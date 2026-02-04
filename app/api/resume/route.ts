import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { resumeUploadSchema } from "@/lib/validations/resume";

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

        const userId = user.id;

        // Parse form data
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate with Zod
        const validation = resumeUploadSchema.safeParse({ file });

        if (!validation.success) {
            const errorMessage = validation.error.issues[0]?.message || "Invalid file";
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const storagePath = `${userId}/${timestamp}-${sanitizedFileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("resumes")
            .upload(storagePath, file, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            return NextResponse.json(
                { error: "Failed to upload file" },
                { status: 500 }
            );
        }

        // Store path instead of URL to avoid private bucket issues and expiration
        const fileUrl = uploadData.path;

        // Create database record
        const { data: resumeData, error: dbError } = await supabase
            .from("resumes")
            .insert({
                user_id: userId,
                file_url: fileUrl,
                file_name: file.name,
                file_size: file.size,
                mime_type: file.type,
                parse_status: "PENDING",
            })
            .select()
            .single();

        if (dbError) {
            console.error("Database insert error:", dbError);
            // Cleanup: delete uploaded file
            await supabase.storage.from("resumes").remove([storagePath]);
            return NextResponse.json(
                { error: "Failed to create resume record" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            resumeId: resumeData.id,
            fileName: resumeData.file_name,
        });
    } catch (error) {
        console.error("Resume upload error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
