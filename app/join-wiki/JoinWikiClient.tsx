'use client'

import { signOut } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function JoinWikiClient({ isMember }: { isMember: boolean }) {
    const router = useRouter()
    const supabase = createClient()
    const [accessCode, setAccessCode] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isJoining, setIsJoining] = useState(false)
    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleJoinWiki = async () => {
        setErrorMessage('')
        setIsJoining(true)

        const { data } = await supabase.auth.getUser()
        const user = data?.user

        if (!user) {
            setErrorMessage('You must be logged in.')
            setIsJoining(false)
            return
        }

        const { data: wiki, error: wikiError } = await supabase.from('wikis').select('id').eq('access_code', accessCode).single()

        if (wikiError || !wiki) {
            setErrorMessage('Invalid access code.')
            setIsJoining(false)
            return
        }

        const { error: membershipError } = await supabase.from('wiki_memberships').insert([{ user_id: user.id, wiki_id: wiki.id }])

        if (membershipError) {
            setErrorMessage('Failed to join wiki.')
            setIsJoining(false)
            return
        }

        router.push('/')
    }

    const handleSignOut = async () => {
        setIsSigningOut(true)
        await signOut()
    }

    const handleCancel = () => {
        router.push('/')
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
            <Button
                onClick={handleSignOut}
                className="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white shadow hover:bg-red-600"
                aria-label="Sign Out"
                size="icon"
                variant="destructive"
                disabled={isSigningOut}
            >
                <LogOut size={24} />
            </Button>

            <Card className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">{isMember ? 'Join a Wiki' : 'Join Your First Wiki!'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {errorMessage && <p className="text-center text-sm text-red-500">{errorMessage}</p>}

                    <div>
                        <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700">
                            Enter Access Code
                        </label>
                        <Input id="accessCode" type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Enter Code" />
                    </div>

                    <div className={`flex ${isMember ? 'justify-between' : 'justify-center'} space-x-4`}>
                        <Button onClick={handleJoinWiki} className="w-full" disabled={isJoining}>
                            {isJoining ? 'Joining...' : 'Join Wiki'}
                        </Button>
                        {isMember && (
                            <Button onClick={handleCancel} variant="outline" className="w-full">
                                Cancel
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
