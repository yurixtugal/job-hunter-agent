import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
                        <div className="flex items-center gap-4 p-4 border rounded-lg bg-accent/20">
                            <FileText className="h-8 w-8 text-primary" />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{resume?.file_name}</p>
                                <p className="text-xs text-muted-foreground">
                                    Uploaded on {new Date(resume?.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <a href={resume?.file_url} target="_blank" rel="noopener noreferrer">
                                    View
                                </a>
                            </Button>
                        </div>

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
                        <div className="text-center py-8 space-y-3">
                            <div className="p-3 bg-muted rounded-full w-fit mx-auto">
                                <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium">Analysis Pending</p>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    We haven't analyzed this resume yet. Check back soon for AI-powered insights.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
