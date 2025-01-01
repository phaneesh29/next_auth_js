"use client"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast, { Toaster } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter()

  const errorNotify = (msg: string) => toast.error(msg, {
    position: "top-center",
    duration: 4000,
  });

  const successNotify = (msg: string) => toast.success(msg, {
    position: "top-center",
    duration: 4000,
  });

  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  })
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSignup = async () => {
    if (!user.email || !user.password || !user.username) {
      errorNotify("All Fields are required")
      return
    }
    try {
      setButtonDisabled(true)
      setLoading(true)

      const response = await axios.post("/api/users/signup", user)
      successNotify(response.data.message)
      router.push("/login")
    } catch (error: any) {
      errorNotify(error?.response?.data?.error || error.message || "Something went wrong")
    } finally {
      setButtonDisabled(false)
      setLoading(false)
    }

  }

  useEffect(() => {
    if (user.email && user.password && user.username) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
  }, [user])




  return (
    <div className="flex justify-center items-center h-screen w-screen flex-col gap-6">
      <Toaster />

      <h1 className="text-2xl font-semibold mb-8">{loading ? "Processing" : "Sign Up"}</h1>

      <div className="flex flex-col justify-center items-start gap-1 text-lg">
        <label className="w-[100px]" htmlFor="username">Username: </label>
        <input value={user.username} type="text" id="username" onChange={(e) => setUser({ ...user, username: e.target.value })} placeholder="Username" className="bg-transparent ring-2 ring-slate-700 p-2 rounded-lg w-[300px] focus:outline-none" />
      </div>

      <div className="flex flex-col justify-center items-start gap-1 text-lg">
        <label className="w-[100px]" htmlFor="email">Email</label>
        <input value={user.email} type="email" id="email" onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="someone@someone.com" className="bg-transparent ring-2 ring-slate-700 p-2 rounded-lg w-[300px] focus:outline-none" />
      </div>

      <div className="flex flex-col justify-center items-start gap-1 text-lg">
        <label className="w-[100px]" htmlFor="password">Password</label>
        <input value={user.password} type="password" id="password" onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="Password" className="bg-transparent ring-2 ring-slate-700 p-2 rounded-lg w-[300px] focus:outline-none" />
      </div>

      <div className="flex flex-col justify-center  gap-1 text-lg">
        <button onClick={onSignup} disabled={buttonDisabled} className={`p-3 bg-blue-800 rounded-lg hover:bg-blue-500 transition-all duration-300 ${buttonDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>{buttonDisabled ? "----" : "Signup"}</button>
        <span className="text-sm ">Already have an account, <Link href="/login" className="text-indigo-500">Login </Link></span>
      </div>
    </div>
  )
}