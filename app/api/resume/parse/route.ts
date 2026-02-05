import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { downloadResumeFromStorage, generateResumeJSON } from "@/lib/resume/service";

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

        try {
            // Download file using shared service
            // The service handles path normalization and buffer conversion
            const fileBuffer = await downloadResumeFromStorage(supabase, resume.file_url);

            // Generate JSON using shared service
            // This handles PDF extraction + AI parsing
            const parsedData = await generateResumeJSON(fileBuffer);

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

        } catch (processError: any) {
            console.error("Resume processing error:", processError);

            // Update status to FAILED on error
            await supabase
                .from("resumes")
                .update({
                    parse_status: "FAILED",
                    parse_error: processError.message || "Unknown error during processing"
                })
                .eq("id", resumeId);

            return NextResponse.json(
                { error: processError.message || "Failed to process resume" },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Resume parse endpoint exception:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
