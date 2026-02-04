import { z } from "zod";

export const resumeSchema = z.object({
    profile: z.object({
        fullName: z.string().describe("The full name of the candidate"),
        email: z.string().nullable().describe("The email address of the candidate"),
        phone: z.string().nullable().describe("The phone number of the candidate"),
        location: z.string().nullable().describe("Current city and country/state"),
        links: z.array(z.string()).nullable().describe("Professional links like LinkedIn, GitHub, or Portfolio"),
        summary: z.string().nullable().describe("A brief professional summary or objective"),
    }),
    workExperience: z.array(z.object({
        company: z.string(),
        position: z.string(),
        startDate: z.string().describe("Format: YYYY-MM or YYYY-MM-DD"),
        endDate: z.string().nullable().describe("Format: YYYY-MM, YYYY-MM-DD, or 'Present'"),
        isCurrent: z.boolean().nullable(),
        description: z.string().describe("Detailed description of roles and responsibilities"),
        technologies: z.array(z.string()).nullable().describe("Tech stack used in this role"),
    })).describe("Work experience in reverse chronological order"),
    education: z.array(z.object({
        institution: z.string(),
        degree: z.string(),
        fieldOfStudy: z.string().nullable(),
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
    })).nullable(),
    skills: z.object({
        technical: z.array(z.string()).describe("Hard skills, programming languages, tools"),
        soft: z.array(z.string()).nullable().describe("Soft skills like leadership, communication"),
        languages: z.array(z.string()).nullable().describe("Spoken languages"),
    }),
    projects: z.array(z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()).nullable(),
        link: z.string().nullable().describe("URL to the project"),
    })).nullable(),
});

export type ParsedResume = z.infer<typeof resumeSchema>;
