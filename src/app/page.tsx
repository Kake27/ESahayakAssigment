"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"

export default function Home() {
    const {user, loading} = useUser()
    const router = useRouter()

    useEffect(() => {
        if(!loading) {
            if(user) {
                router.replace("/buyers")
            }
            else {
                router.replace("/login")
            }
        }
    }, [user, loading, router])

    if (loading) {
        return <p>Loading...</p>
    }

    return null;
}