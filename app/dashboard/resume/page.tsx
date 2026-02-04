import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ResumeAnalyzer } from "@/components/dashboard/ResumeAnalyzer";
import { ParsedResume } from "@/lib/validations/resume-parser";

export default async function ResumePage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: resume } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    let fileViewUrl = resume?.file_url;
    if (resume?.file_url && !resume.file_url.startsWith("http")) {
        // If it's a path, generate a signed URL
        const { data } = await supabase.storage.from("resumes").createSignedUrl(resume.file_url, 3600); // 1 hour expiry
        if (data?.signedUrl) {
            fileViewUrl = data.signedUrl;
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Resume</h1>
                <p className="text-muted-foreground">
                    Manage your resume and view AI insights
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Resume</CardTitle>
                        <CardDescription>
                            The file currently being used for job applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {resume ? (
                            <>
                                <div className="flex items-center gap-4 p-4 border rounded-lg bg-accent/20">
                                    <FileText className="h-8 w-8 text-primary" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate">{resume.file_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Uploaded on {new Date(resume.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={fileViewUrl} target="_blank" rel="noopener noreferrer">
                                            View
                                        </a>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">No resume uploaded yet</p>
                            </div>
                        )}

                        <Button className="w-full" asChild>
                            <Link href="/upload-resume">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload New Version
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>AI Analysis</CardTitle>
                        <CardDescription>
                            Insights extracted from your resume
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {resume ? (
                            <ResumeAnalyzer
                                resumeId={resume.id}
                                initialStatus={resume.parse_status || "PENDING"}
                                parsedData={resume.parsed_data as ParsedResume} // Safe cast due to logic
                            />
                        ) : (
                            <div className="text-center py-8 space-y-3">
                                <div className="p-3 bg-muted rounded-full w-fit mx-auto">
                                    <FileText className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium">No Resume Found</p>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                        Upload a resume to unlock AI insights.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
