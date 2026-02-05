import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/parser/pdf-extract";
import { parseResume } from "@/lib/ai/resume-analyzer";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Check authentication
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { resumeId } = await request.json();

        if (!resumeId) {
            return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
        }

        // Fetch resume record
        const { data: resume, error: fetchError } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", resumeId)
            .eq("user_id", user.id)
            .single();

        if (fetchError || !resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        // Update status to PROCESSING
        await supabase
            .from("resumes")
            .update({ parse_status: "PROCESSING" })
            .eq("id", resumeId);

        // Download file
        // resume.file_url now stores the storage path (or legacy URL)
        let fileBuffer: Buffer;
        let storagePath = resume.file_url;

        // Backward compatibility: Extract path if it look like a URL
        if (storagePath.startsWith("http")) {
            const storageUrlPrefix = "/storage/v1/object/public/resumes/";
            if (storagePath.includes(storageUrlPrefix)) {
                storagePath = storagePath.split(storageUrlPrefix)[1];
            } else if (storagePath.includes("/resumes/")) {
                storagePath = storagePath.split("/resumes/")[1];
            }
            // Clean up any URL encoding or query params
            storagePath = decodeURIComponent(storagePath.split("?")[0]);
        }

        console.log("Downloading from storage path:", storagePath);

        try {
            const { data: fileData, error: downloadError } = await supabase.storage
                .from("resumes")
                .download(storagePath);

            if (downloadError) {
                console.error("Supabase storage download error:", downloadError);
                throw downloadError;
            }
            if (!fileData) {
                throw new Error("No data returned from storage download");
            }
            const arrayBuffer = await fileData.arrayBuffer();
            fileBuffer = Buffer.from(arrayBuffer);

        } catch (downloadError: any) {
            // Fallback to fetch only if it looked like a URL originally and download failed
            if (resume.file_url.startsWith("http")) {
                console.log("Storage download failed, attempting fallback fetch for URL:", resume.file_url);
                try {
                    const response = await fetch(resume.file_url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
                    }
                    const arrayBuffer = await response.arrayBuffer();
                    fileBuffer = Buffer.from(arrayBuffer);
                } catch (fetchError) {
                    console.error("Error fetching file (fallback):", fetchError);
                    throw new Error("Failed to download resume file");
                }
            } else {
                console.error("Error downloading file:", downloadError);
                throw new Error("Failed to download resume file");
            }
        }

        try {
            // Extract text
            const text = await extractTextFromPDF(fileBuffer);
            console.log("Extracted text length:", text.length);

            // Parse with AI
            const parsedData = await parseResume(text);

            // Update parsed data
            const { error: updateError } = await supabase
                .from("resumes")
                .update({
                    parsed_data: parsedData,
                    parse_status: "COMPLETED",
                })
                .eq("id", resumeId);

            if (updateError) throw updateError;

            return NextResponse.json({ success: true, data: parsedData });

        } catch (parseError: any) {
            console.error("Parsing logic error:", parseError);
            await supabase
                .from("resumes")
                .update({
                    parse_status: "FAILED",
                    parse_error: parseError.message || "Unknown parsing error"
                })
                .eq("id", resumeId);

            return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 });
        }

    } catch (error) {
        console.error("Resume parse endpoint error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
