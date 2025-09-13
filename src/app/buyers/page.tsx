"use client"

import { useUser } from "@/context/UserContext"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Buyers() {
    const {user, logout} = useUser()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.replace("/login")
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Buyer Leads</h1>
                {user && (
                <div className="flex items-center gap-4">
                    <span className="text-gray-700">Logged in as: {user.name}</span>
                    <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                    Logout
                    </button>
                </div>
                )}
            </div>

            {/* 👇 Your buyers list table will go here */}
            <p>TODO: Render buyers list...</p>
        </div>
    )
}