"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"
import { useState } from "react"

export default function Home() {
    const {user, login, loading} = useUser()
    const router = useRouter()

    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loadingPage, setLoading] = useState(false);

    useEffect(() => {
        if(!loading) {
            if(user) {
                router.replace("/buyers")
            }
        }
    }, [user, loading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            login({ id: data.id, name: data.name });

            router.push("/buyers");
            } catch (err) {
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

    return (
        <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-md w-96"
      >
        <h1 className="text-xl font-semibold mb-4">Login</h1>

        <label className="block mb-2 text-sm font-medium">
          Enter your name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          placeholder="Your name"
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
    )
}