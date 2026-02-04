import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function JobsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Job Search</h1>
                <p className="text-muted-foreground">
                    Find openings tailored to your profile
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search for roles, skills, or companies..."
                        className="pl-8"
                    />
                </div>
                <Button>Search</Button>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[400px] text-center border rounded-lg bg-muted/10 border-dashed">
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                    <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Start your search</h3>
                <p className="text-muted-foreground max-w-sm">
                    Enter keywords above to find relevant job opportunities suited to your skills.
                </p>
            </div>
        </div>
    );
}
