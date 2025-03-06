'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function CreatePostContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const wikiId = searchParams.get('wiki_id')

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [keywords, setKeywords] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!wikiId) {
            console.error('No wiki selected')
            return
        }

        const res = await fetch('/api/create-post', {
            method: 'POST',
            body: JSON.stringify({
                title,
                content,
                keywords: keywords.split(',').map((kw) => kw.trim()),
                wiki_id: wikiId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (res.ok) {
            router.push('/')
        } else {
            console.error('Failed to create post')
        }
    }

    const handleCancel = () => {
        router.push('/')
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
            <Card className="w-full max-w-xl shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Create a New Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">
                                Post Title
                            </label>
                            <Input
                                id="post-title"
                                type="text"
                                placeholder="Enter post title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">
                                Post Content
                            </label>
                            <Textarea
                                id="post-content"
                                placeholder="Enter post content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={6}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="post-keywords" className="block text-sm font-medium text-gray-700">
                                Keywords (comma-separated)
                            </label>
                            <Input
                                id="post-keywords"
                                type="text"
                                placeholder="e.g., orders, checkout, bugfix"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex justify-between space-x-4">
                            <Button type="submit" className="w-full">
                                Create Post
                            </Button>
                            <Button type="button" variant="outline" className="w-full" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function CreatePost() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreatePostContent />
        </Suspense>
    )
}
