'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from 'lucide-react'
import { signupSchema, type SignupFormData } from '@/lib/validations/auth'

export default function SignUpPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    })

    async function onSubmit(data: SignupFormData) {
        setError('')
        setSuccess('')
        setLoading(true)

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.error || 'Failed to create account')
                setLoading(false)
                return
            }

            // Show success message
            setSuccess(result.message)

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/dashboard')
                router.refresh()
            }, 2000)
        } catch (err) {
            setError('An unexpected error occurred')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side - Form */}
            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 w-fit">
                        <Target className="w-8 h-8 text-primary" />
                        <span className="text-xl font-bold">Job Hunter Agent</span>
                    </Link>

                    {/* Form Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Create an account</CardTitle>
                            <CardDescription>
                                Get started with your job hunting journey
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register('email')}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password.message}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Must be at least 8 characters
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('confirmPassword')}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                {error && (
                                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                                        {success}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating account...' : 'Sign Up'}
                                </Button>

                                <p className="text-center text-sm text-muted-foreground">
                                    Already have an account?{' '}
                                    <Link
                                        href="/sign-in"
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right side - Illustration */}
            <div className="hidden lg:flex items-center justify-center bg-muted relative">
                <Image
                    src="/images/auth-illustration.png"
                    alt="Job Hunter illustration"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    )
}
