"use client"

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Changepassword() {
    const router = useRouter()
    const [token, setToken] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const errorNotify = (msg: string) => toast.error(msg, {
        position: "top-center",
        duration: 4000,
    });

    const successNotify = (msg: string) => toast.success(msg, {
        position: "top-center",
        duration: 4000,
    });

    const changePass = async () => {
        try {
            setButtonDisabled(true)
            setLoading(true)
            if (password !== confirmPassword) {
                errorNotify("Passwords do not match")
                return
            }
            const response = await axios.post('/api/users/changepassword', { token, password, confirmPassword })
            successNotify(response.data.message);
            router.push("/login")

        } catch (error: any) {
            errorNotify(error?.response?.data?.error || error.message || "Something went wrong")
        } finally {
            setButtonDisabled(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (password && confirmPassword) {
            setButtonDisabled(false)
        } else {
            setButtonDisabled(true)
        }
    }, [password, confirmPassword])

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);


    return (
        <div className="flex flex-col items-center justify-center gap-16 min-h-screen py-2">
            <Toaster />
            <h1 className="text-2xl font-semibold mb-8">{loading ? "Processing" : "Change Password"}</h1>
            <div className="flex flex-col justify-center items-start gap-5">
                <div className="flex flex-col justify-center items-start gap-1 text-lg">
                    <label className="w-[100px]" htmlFor="password">Password</label>
                    <input value={password} type="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="bg-transparent ring-2 ring-slate-700 p-2 rounded-lg w-[300px] focus:outline-none" />
                </div>
                <div className="flex flex-col justify-center items-start gap-1 text-lg">
                    <label className="w-[200px]" htmlFor="password">Confirm Password</label>
                    <input value={confirmPassword} type="password" id="password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="bg-transparent ring-2 ring-slate-700 p-2 rounded-lg w-[300px] focus:outline-none" />
                </div>
            </div>
            <div className="flex flex-col justify-center  gap-1 text-lg">
                <button onClick={changePass} disabled={buttonDisabled} className={`p-3 bg-blue-800 rounded-lg hover:bg-blue-500 transition-all duration-300 ${buttonDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>{buttonDisabled ? "----" : "Change"} </button>
                <span className="text-sm ">Login , <Link href="/login" className="text-indigo-500">here </Link></span>
            </div>

        </div>

    )
}
