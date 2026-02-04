import { Briefcase } from "lucide-react";

export default function ApplicationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                <p className="text-muted-foreground">
                    Track the status of your job applications
                </p>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[400px] text-center border rounded-lg bg-muted/10 border-dashed">
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground max-w-sm">
                    Applications you track via the Job Hunter extension will appear here automatically.
                </p>
            </div>
        </div>
    );
}
