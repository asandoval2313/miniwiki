'use server'

import { createClient } from '@/utils/supabase/server'
import JoinWikiClient from './JoinWikiClient'

export default async function JoinWikiPage() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const user = data?.user

    if (!user) {
        return <JoinWikiClient isMember={false} />
    }

    const { data: memberships } = await supabase.from('wiki_memberships').select('wiki_id').eq('user_id', user.id)

    const isMember = memberships && memberships.length > 0 ? true : false

    return <JoinWikiClient isMember={isMember} />
}
