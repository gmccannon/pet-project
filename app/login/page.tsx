'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    if (res?.ok) {
      router.push("/")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80 space-y-4">
        <h1 className="text-xl font-bold">Login</h1>
        {error && <p className="text-red-600">{error}</p>}
        <input type="email" placeholder="Email" className="border w-full p-2" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="border w-full p-2" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  )
}
