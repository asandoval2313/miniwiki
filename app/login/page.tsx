'use client'

import Link from 'next/link'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { login } from './actions'

export default function LoginPage() {
    const initialState = { error: null }
    const [state, formAction] = useActionState(login, initialState)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (state.error) {
            setIsLoading(false)
        }
    }, [state.error])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const formData = new FormData(event.currentTarget)

        startTransition(() => {
            formAction(formData)
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-lg">
                <h2 className="text-center text-2xl font-bold text-gray-800">Welcome Back</h2>

                {state.error && <div className="mb-4 text-center text-sm text-red-600">{state.error}</div>}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        placeholder="you@example.com"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        placeholder="••••••••"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isLoading ? 'cursor-not-allowed bg-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Log in'}
                </button>

                <p className="text-center text-sm text-gray-600">
                    {`Don't have an account?`}{' '}
                    <Link href="/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    )
}
