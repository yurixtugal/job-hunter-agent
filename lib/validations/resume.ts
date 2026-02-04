import { z } from "zod";

// Allowed file types
const ALLOWED_FILE_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
] as const;

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const resumeUploadSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "File size must be less than 5MB",
        })
        .refine((file) => ALLOWED_FILE_TYPES.includes(file.type as any), {
            message: "File must be a PDF or DOCX",
        }),
});

export type ResumeUploadInput = z.infer<typeof resumeUploadSchema>;
