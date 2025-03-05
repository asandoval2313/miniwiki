import { createClient } from '@/utils/supabase/client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PostPageProps {
    params: { id: string }
}

export default async function PostPage({ params }: PostPageProps) {
    const supabase = createClient()
    const postId = params.id

    const { data: post, error } = await supabase.from('posts').select('*, profiles(first_name, last_name)').eq('id', postId).single()

    if (error || !post) {
        return notFound()
    }

    const authorName = post.profiles ? `${post.profiles.first_name} ${post.profiles.last_name}` : 'Unknown Author'

    return (
        <div className="min-h-screen bg-gray-100 px-6 py-10">
            <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow-md">
                <Link href="/" className="mb-4 flex items-center text-blue-600 hover:underline">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to Home
                </Link>

                <h1 className="mb-2 text-4xl font-bold text-gray-800">{post.title}</h1>

                <div className="mb-2 text-sm text-gray-500">Author: {authorName}</div>

                <div className="mb-6 text-sm text-gray-500">Keywords: {post.keywords.join(', ')}</div>

                <div className="mb-6 whitespace-pre-wrap text-lg leading-relaxed text-gray-700">{post.content}</div>

                <div className="text-right text-sm text-gray-400">Posted on {new Date(post.created_at).toLocaleDateString()}</div>
            </div>
        </div>
    )
}
