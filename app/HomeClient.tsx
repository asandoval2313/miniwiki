'use client'

import { signOut } from '@/app/actions'
import SearchBar from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'
import { LogOut, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'

interface Post {
    id: string
    title: string
    content: string
    keywords: string[]
    created_at: string
}

interface Wiki {
    id: string
    name: string
}

interface HomeClientProps {
    wikis: Wiki[]
    initialWikiId: string | null
}

export default function HomeClient({ wikis, initialWikiId }: HomeClientProps) {
    const router = useRouter()
    const supabase = useMemo(() => createClient(), [])
    const [results, setResults] = useState<Post[]>([])
    const [searchPerformed, setSearchPerformed] = useState(false)
    const [selectedWiki, setSelectedWiki] = useState<string | null>(initialWikiId)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (selectedWiki) {
            const fetchPosts = async () => {
                const { data } = await supabase.from('posts').select('*').eq('wiki_id', selectedWiki)
                setResults(data || [])
            }
            fetchPosts()
        }
    }, [selectedWiki, supabase])

    const handleSearch = async (query: string) => {
        const lowerQuery = query.toLowerCase().trim()

        if (lowerQuery === '') {
            setResults([])
            return
        }

        const { data } = await supabase.from('posts').select('*').eq('wiki_id', selectedWiki)

        if (data) {
            const filtered = data.filter(
                (post) =>
                    post.title.toLowerCase().includes(lowerQuery) ||
                    post.content.toLowerCase().includes(lowerQuery) ||
                    post.keywords.some((keyword: string) => keyword.toLowerCase().includes(lowerQuery))
            )
            setSearchPerformed(true)
            setResults(filtered)
        }
    }

    const handleCreatePost = () => {
        if (selectedWiki) {
            router.push(`/create-post?wiki_id=${selectedWiki}`)
        }
    }

    const handleViewPost = (id: string) => {
        router.push(`/post/${id}`)
    }

    const handleSignOut = () => {
        startTransition(() => {
            signOut()
        })
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4">
            <Button
                onClick={handleCreatePost}
                className="absolute right-16 top-4 rounded-full bg-blue-500 p-2 text-white shadow hover:bg-blue-600"
                aria-label="Create New Post"
                size="icon"
            >
                <Plus size={24} />
            </Button>

            <Button
                onClick={handleSignOut}
                className="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white shadow hover:bg-red-600"
                aria-label="Sign Out"
                size="icon"
                variant="destructive"
                disabled={isPending}
            >
                <LogOut size={24} />
            </Button>

            <h1 className="mb-6 text-4xl font-bold">Mini-Wiki</h1>

            <div className="mb-6">
                <Select
                    onValueChange={(value) => {
                        if (value === 'join-wiki') {
                            router.push('/join-wiki')
                        } else {
                            setSelectedWiki(value)
                        }
                    }}
                    value={selectedWiki || ''}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a Wiki" />
                    </SelectTrigger>
                    <SelectContent>
                        {wikis.map((wiki) => (
                            <SelectItem key={wiki.id} value={wiki.id}>
                                {wiki.name}
                            </SelectItem>
                        ))}
                        <SelectItem key="join-wiki" value="join-wiki" className="flex items-center px-3 py-2 font-medium text-blue-600">
                            <Plus className="inline-block h-4 w-4" />
                            <span className="ml-1 inline-block">Join a Wiki</span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <SearchBar onSearch={handleSearch} />

            <div className="mt-4 w-full max-w-2xl">
                {searchPerformed ? (
                    results.length > 0 ? (
                        results.map((post) => (
                            <Card
                                key={post.id}
                                onClick={() => handleViewPost(post.id)}
                                className="my-2 cursor-pointer rounded-lg border p-4 shadow transition hover:bg-gray-100"
                            >
                                <CardContent className="p-0">
                                    <h2 className="text-xl font-semibold">{post.title}</h2>
                                    <p className="text-gray-600">{post.content}</p>
                                    <p className="mt-2 text-sm text-gray-500">Keywords: {post.keywords.join(', ')}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No results found.</p>
                    )
                ) : (
                    <p className="text-center text-gray-500">Search to see results.</p>
                )}
            </div>
        </div>
    )
}
