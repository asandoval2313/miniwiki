import { SignedIn, SignedOut } from '@clerk/nextjs'

export default function Home() {
    return (
        <>
            <SignedIn>
                <div>Hello, World!</div>
            </SignedIn>
            <SignedOut>
                <div>Please sign in to continue.</div>
            </SignedOut>
        </>
    )
}
