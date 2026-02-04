import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Target } from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/sign-in')
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Target className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold">Job Hunter Agent</span>
                    </div>
                    <LogoutButton />
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome to Your Dashboard! 🎯</h1>
                        <p className="text-muted-foreground">
                            Logged in as: <span className="font-medium text-foreground">{user.email}</span>
                        </p>
                    </div>

                    <div className="border rounded-lg p-8 text-center space-y-4">
                        <h2 className="text-2xl font-semibold">Dashboard Coming Soon</h2>
                        <p className="text-muted-foreground">
                            This is where you'll manage your resume, track applications, and chat with your AI agent.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
