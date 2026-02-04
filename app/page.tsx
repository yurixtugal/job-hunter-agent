import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Job Hunter Agent</span>
          </div>
          <div className="flex gap-3">
            {session ? (
              <Link href="/dashboard">
                <Button>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            Your Personal AI Agent to Dominate the Job Hunt
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Automate, analyze, and optimize your job search with AI-powered resume parsing,
            job analysis, and application tracking—all in one place.
          </p>

          <div className="flex gap-4 justify-center">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="px-8">
                  Continue to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg">
                    Start Hunting Jobs
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Resume Parser</h3>
            <p className="text-muted-foreground">
              Upload your CV and let AI extract and structure your experience automatically.
            </p>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Job Analyzer</h3>
            <p className="text-muted-foreground">
              Extract tech stack, salary estimates, and red flags from job postings instantly.
            </p>
          </div>

          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Application Tracker</h3>
            <p className="text-muted-foreground">
              Track all your applications in a beautiful Kanban board or list view.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with Next.js 16, Vercel AI SDK, and OpenAI</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
