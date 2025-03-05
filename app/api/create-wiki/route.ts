import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const supabase = await createClient()
    const { name } = await req.json()

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
        .from('wikis')
        .insert([
            {
                name,
                created_by: user.id
            }
        ])
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: 'Failed to create wiki' }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
}
