"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { resumeUploadSchema, type ResumeUploadInput } from "@/lib/validations/resume";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function UploadResumePage() {
    const router = useRouter();
    const [status, setStatus] = useState<UploadStatus>("idle");
    const [progress, setProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm<ResumeUploadInput>({
        resolver: zodResolver(resumeUploadSchema),
    });

    const file = watch("file");

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setValue("file", droppedFile, { shouldValidate: true });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setValue("file", selectedFile, { shouldValidate: true });
        }
    };

    const onSubmit = async (data: ResumeUploadInput) => {
        setStatus("uploading");
        setProgress(0);
        setUploadError(null);

        const formData = new FormData();
        formData.append("file", data.file);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 10, 90));
            }, 200);

            const response = await fetch("/api/resume", {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Upload failed");
            }

            setStatus("success");

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (err) {
            setStatus("error");
            setUploadError(err instanceof Error ? err.message : "Upload failed");
            setProgress(0);
        }
    };

    const resetUpload = () => {
        reset();
        setStatus("idle");
        setProgress(0);
        setUploadError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">Upload Your Resume</h1>
                        <p className="text-muted-foreground text-lg">
                            Upload your CV and let AI extract your experience automatically
                        </p>
                    </div>

                    {/* Upload Card */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Resume File
                                </CardTitle>
                                <CardDescription>
                                    Supported formats: PDF, DOCX (Max 5MB)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Dropzone */}
                                {status === "idle" && !file && (
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`
                                            border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
                                            ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50"}
                                        `}
                                    >
                                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-lg font-medium mb-2">
                                            Drag & drop your resume here
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-4">or</p>
                                        <label htmlFor="file-upload">
                                            <Button variant="outline" className="cursor-pointer" asChild>
                                                <span>Browse Files</span>
                                            </Button>
                                        </label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept=".pdf,.docx"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                )}

                                {/* Validation Error */}
                                {errors.file && (
                                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-destructive" />
                                        <p className="text-sm text-destructive">{errors.file.message}</p>
                                    </div>
                                )}

                                {/* File Selected */}
                                {file && status === "idle" && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                                            <FileText className="w-8 h-8 text-primary" />
                                            <div className="flex-1">
                                                <p className="font-medium">{file.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={resetUpload} type="button">
                                                Remove
                                            </Button>
                                        </div>
                                        <Button type="submit" className="w-full" size="lg">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Resume
                                        </Button>
                                    </div>
                                )}

                                {/* Uploading */}
                                {status === "uploading" && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                            <div className="flex-1">
                                                <p className="font-medium">Uploading {file?.name}...</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Please wait while we process your file
                                                </p>
                                            </div>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                )}

                                {/* Success */}
                                {status === "success" && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                            <div className="flex-1">
                                                <p className="font-medium text-green-700 dark:text-green-400">
                                                    Upload Successful!
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Redirecting to dashboard...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Error */}
                                {(status === "error" || uploadError) && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                            <AlertCircle className="w-8 h-8 text-destructive" />
                                            <div className="flex-1">
                                                <p className="font-medium text-destructive">Upload Failed</p>
                                                <p className="text-sm text-muted-foreground">{uploadError}</p>
                                            </div>
                                        </div>
                                        <Button onClick={resetUpload} variant="outline" className="w-full" type="button">
                                            Try Again
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </form>

                    {/* Info Card */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium">What happens next?</p>
                                    <p className="text-sm text-muted-foreground">
                                        Your resume will be securely stored and processed by our AI to extract
                                        your work experience, education, and skills automatically.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
