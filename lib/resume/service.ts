import { SupabaseClient } from "@supabase/supabase-js";
import { extractTextFromPDF } from "@/lib/parser/pdf-extract";
import { parseResume } from "@/lib/ai/resume-analyzer";

/**
 * Downloads a resume file from Supabase Storage.
 * Handles both direct storage paths and full URLs (legacy).
 * @param supabase Authenticated Supabase client
 * @param fileUrlOrPath The file_url stored in the database
 * @returns Buffer containing the file data
 */
export async function downloadResumeFromStorage(
    supabase: SupabaseClient,
    fileUrlOrPath: string
): Promise<Buffer> {
    let storagePath = fileUrlOrPath;

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

    const { data: fileData, error: downloadError } = await supabase.storage
        .from("resumes")
        .download(storagePath);

    if (downloadError) {
        console.error("Supabase storage download error:", downloadError);
        throw new Error(`Failed to download resume file: ${downloadError.message}`);
    }

    if (!fileData) {
        throw new Error("No data returned from storage download");
    }

    const arrayBuffer = await fileData.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

/**
 * Extracts text from a PDF buffer and parses it using AI.
 * @param buffer Buffer containing the PDF data
 * @returns Structured resume data
 */
export async function generateResumeJSON(buffer: Buffer) {
    try {
        // Extract text from PDF
        const text = await extractTextFromPDF(buffer);
        console.log("Extracted text length:", text.length);

        // Parse with AI
        const parsedData = await parseResume(text);

        return parsedData;
    } catch (error: any) {
        console.error("Resume generation error:", error);
        throw new Error(error.message || "Failed to process resume content");
    }
}
