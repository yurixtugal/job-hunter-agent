"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Wand2, CheckCircle2, AlertCircle } from "lucide-react";
import { ParsedResume } from "@/lib/validations/resume-parser";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface ResumeAnalyzerProps {
    resumeId: string;
    initialStatus: string;
    parsedData: ParsedResume | null;
}

export function ResumeAnalyzer({ resumeId, initialStatus, parsedData }: ResumeAnalyzerProps) {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAnalyze = async () => {
        try {
            setIsLoading(true);
            setStatus("PROCESSING");

            const response = await fetch("/api/resume/parse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to analyze resume");
            }

            setStatus("COMPLETED");
            router.refresh();

        } catch (error) {
            console.error("Analysis error:", error);
            setStatus("FAILED");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "COMPLETED" && parsedData) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">AI Analysis Completed</span>
                </div>

                {/* Profile Summary */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold">{parsedData.profile.fullName}</h3>
                                <p className="text-muted-foreground">{parsedData.profile.email}</p>
                                {parsedData.profile.location && (
                                    <p className="text-sm text-muted-foreground">{parsedData.profile.location}</p>
                                )}
                            </div>
                        </div>
                        {parsedData.profile.summary && (
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p className="text-sm italic">{parsedData.profile.summary}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Skills */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardContent className="pt-6">
                            <h4 className="font-semibold mb-3">Technical Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {parsedData.skills.technical.map((skill, i) => (
                                    <Badge key={i} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <h4 className="font-semibold mb-3">Soft Skills & Languages</h4>
                            <div className="space-y-3">
                                {parsedData.skills.soft && (
                                    <div className="flex flex-wrap gap-2">
                                        {parsedData.skills.soft.map((skill, i) => (
                                            <Badge key={i} variant="outline">{skill}</Badge>
                                        ))}
                                    </div>
                                )}
                                {parsedData.skills.languages && (
                                    <div className="flex flex-wrap gap-2">
                                        {parsedData.skills.languages.map((lang, i) => (
                                            <Badge key={i} variant="outline" className="border-primary/20">{lang}</Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Experience */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    {parsedData.workExperience.map((job, i) => (
                        <Card key={i}>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold">{job.position}</h4>
                                        <p className="text-primary font-medium">{job.company}</p>
                                    </div>
                                    <div className="text-right text-sm text-muted-foreground">
                                        <p>{job.startDate} - {job.endDate || "Present"}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">{job.description}</p>
                                {job.technologies && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {job.technologies.slice(0, 5).map((tech, ti) => (
                                            <span key={ti} className="text-xs bg-accent px-2 py-1 rounded">{tech}</span>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="text-center py-8 space-y-4">
            <div className="p-4 bg-muted/30 rounded-full w-fit mx-auto">
                <Wand2 className="h-8 w-8 text-primary" />
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-lg">AI Resume Analysis</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {status === "FAILED"
                        ? "The analysis failed. Please try again."
                        : "Extract structured data, skills, and insights from your resume using AI."}
                </p>
            </div>

            {status === "FAILED" && (
                <div className="flex items-center justify-center gap-2 text-destructive text-sm bg-destructive/10 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span>Analysis failed. Check your file format.</span>
                </div>
            )}

            <Button
                onClick={handleAnalyze}
                disabled={isLoading || status === "PROCESSING"}
                size="lg"
                className="w-full max-w-xs"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                    </>
                ) : (
                    status === "FAILED" ? "Retry Analysis" : "Start Analysis"
                )}
            </Button>
        </div>
    );
}
