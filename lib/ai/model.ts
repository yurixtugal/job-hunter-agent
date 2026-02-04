import { openai } from "@ai-sdk/openai";

// Global model configuration
// This decouples the application from a specific provider.
// To switch providers (e.g., to Anthropic), simply update this export.
export const resumeParserModel = openai("gpt-4o");
