// MOCK IMPLEMENTATION FOR DEMO/TESTING
// pdf-parse library removed to simplify deployment and testing
// This mock simulates a successful PDF text extraction

import { PDFParse } from "pdf-parse";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
    try {
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        return result.text;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error("Failed to extract text from PDF");
    }
}