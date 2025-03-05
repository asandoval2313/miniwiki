import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const supabase = await createClient()
    const { title, content, keywords, wiki_id } = await req.json()

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!wiki_id) {
        return NextResponse.json({ error: 'Wiki ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase.from('posts').insert([
        {
            title,
            content,
            keywords,
            created_by: user.id,
            wiki_id
        }
    ])

    if (error) {
        console.error('Error creating post:', error)
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
}
