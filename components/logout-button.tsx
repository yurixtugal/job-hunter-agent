'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function LogoutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleLogout() {
        setLoading(true)

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
            })

            if (response.ok) {
                // Redirect to landing page after successful logout
                router.push('/')
                router.refresh()
            } else {
                console.error('Logout failed')
                setLoading(false)
            }
        } catch (error) {
            console.error('Logout error:', error)
            setLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={loading}
        >
            {loading ? 'Logging out...' : 'Logout'}
        </Button>
    )
}
