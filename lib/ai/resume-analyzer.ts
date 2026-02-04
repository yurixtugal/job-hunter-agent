import { generateObject } from "ai";
import { resumeParserModel } from "./model";
import { resumeSchema, type ParsedResume } from "@/lib/validations/resume-parser";

export async function parseResume(text: string): Promise<ParsedResume> {
    try {
        const { object } = await generateObject({
            model: resumeParserModel,
            schema: resumeSchema,
            prompt: `
        You are an expert AI Resume Parser. 
        Extract structured data from the following resume text. 
        Normalize dates to YYYY-MM or YYYY-MM-DD format where possible.
        If a field is missing, leave it as null or omit it according to the schema.
        
        Resume Text:
        ${text}
      `,
        });

        return object;
    } catch (error) {
        console.error("Error analyzing resume with AI:", error);
        throw new Error("Failed to parse resume data");
    }
}
