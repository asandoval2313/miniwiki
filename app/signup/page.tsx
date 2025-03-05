'use client'

import { useActionState } from 'react'
import { signup } from './actions'

export default function SignUp() {
    // ✅ Initial state for form errors
    const initialState = { error: null }
    const [state, formAction] = useActionState(signup, initialState)

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form action={formAction} className="w-full max-w-sm space-y-6 rounded-lg bg-white p-8 shadow-lg">
                <h2 className="text-center text-2xl font-bold text-gray-800">Sign Up</h2>

                {/* Error Display */}
                {state?.error && <p className="text-center text-sm text-red-500">{state.error}</p>}

                {/* First Name */}
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="John"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="Doe"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="you@example.com"
                    />
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                        placeholder="••••••••"
                    />
                </div>

                {/* ✅ Submit Button */}
                <button
                    type="submit"
                    className="w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Sign Up
                </button>

                {/* Link to Sign In */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Sign In
                    </a>
                </p>
            </form>
        </div>
    )
}
