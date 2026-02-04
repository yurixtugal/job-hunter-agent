import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Target, Upload, FileText } from 'lucide-react'
import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

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

                    <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Upload Your Resume</CardTitle>
                                    <CardDescription className="text-base">
                                        Let AI extract your experience automatically
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Upload your CV in PDF or DOCX format and our AI will parse your work experience,
                                education, and skills to help you land your dream job.
                            </p>
                            <Link href="/upload-resume">
                                <Button size="lg" className="w-full">
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Resume
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
