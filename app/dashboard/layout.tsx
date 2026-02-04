import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MobileNav } from "@/components/dashboard/MobileNav";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Check authentication
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/login");
    }

    // Check if user has uploaded a resume (onboarding)
    const { data: resume } = await supabase
        .from("resumes")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    // If no resume, redirect to upload page (onboarding)
    if (!resume) {
        redirect("/upload-resume");
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center border-b px-4 lg:hidden">
                    <MobileNav />
                    <div className="ml-4 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <span className="text-lg font-bold text-primary-foreground">🎯</span>
                        </div>
                        <span className="text-lg font-semibold">Job Hunter</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-background p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
