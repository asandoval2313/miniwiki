'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import HomeClient from './HomeClient'

export default async function HomePage() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data?.user

    if (!user) {
        redirect('/join-wiki')
    }

    const { data: memberships } = await supabase.from('wiki_memberships').select('wiki_id').eq('user_id', user.id)

    if (!memberships || memberships.length === 0) {
        redirect('/join-wiki')
    }

    const wikiIds = memberships.map((m) => m.wiki_id)

    const { data: wikis } = await supabase.from('wikis').select('*').in('id', wikiIds)

    return <HomeClient wikis={wikis || []} initialWikiId={wikis?.[0]?.id || null} />
}
