"use client"
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";


export default function ForgotPage() {
    const errorNotify = (msg: string) => toast.error(msg, {
        position: "top-center",
        duration: 4000,
    });
    const successNotify = (msg: string) => toast.success(msg, {
        position: "top-center",
        duration: 4000,
    });

    const [email, setEmail] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)

    const onForgot = async () => {
        try {
            setButtonDisabled(true)
            setLoading(true)
            const response = await axios.post('/api/users/forgot', { email })
            console.log(response)
            successNotify(response?.data?.message)
        } catch (error: any) {
            errorNotify(error?.response?.data?.error || error.message || "Something went wrong")
        } finally {
            setButtonDisabled(false)
            setLoading(false)
            setEmail("")
        }
    }

    useEffect(() => {
        if (email) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [email])

    return (
        <div className="flex justify-center items-center h-screen w-screen flex-col gap-6">
            <Toaster />
            <h1 className="text-2xl font-semibold mb-8">{loading ? "Processing" : "Forgot Password"}</h1>
            <div className="flex flex-col justify-center items-start gap-1 text-lg">
                <label className="w-[100px]" htmlFor="email">Email</label>
                <input value={email} type="email" id="email" onChange={(e) => setEmail(e.target.value)} placeholder="someone@someone.com" className="bg-transparent ring-2 ring-slate-700 p-2 rounded-lg w-[300px] focus:outline-none" />
                <span className="text-sm mt-2">Login back, <Link href="/login" className="text-indigo-500">Click here </Link></span>

            </div>
            <div className="flex flex-col justify-center  gap-1 text-lg">
                <button onClick={onForgot} disabled={buttonDisabled} className={`p-3 bg-blue-800 rounded-lg hover:bg-blue-500 transition-all duration-300 ${buttonDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>{buttonDisabled ? "----" : "Confirm"} </button>
            </div>
        </div>
    )
}