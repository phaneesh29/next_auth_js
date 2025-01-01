"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [data, setData] = useState<any>({})
    const errorNotify = (msg: string) => toast.error(msg, {
        position: "top-center",
        duration: 4000,
    });
    const successNotify = (msg: string) => toast.success(msg, {
        position: "top-center",
        duration: 4000,
    });

    const onLogout = async () => {
        try {
            setIsButtonDisabled(true)
            const response = await axios.get("/api/users/logout")
            successNotify(response.data.message)
            router.push("/login")

        } catch (error: any) {
            errorNotify(error?.response?.data?.error || error.message || "Something went wrong")
        } finally {
            setIsButtonDisabled(false)

        }
    }

    const getUserDetails = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/users/me')
            console.log(response.data)
            successNotify(response.data.message)
            setData(response.data.data)

        } catch (error: any) {
            errorNotify(error?.response?.data?.error || error.message || "Something went wrong")
            onLogout()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUserDetails()
    }, [])


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <div className="animate-spin text-3xl rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500">

                </div>
            </div>
        )
    }

    return (
        <>
            <Toaster />
            <div className="flex items-center flex-col h-screen w-screen">
                <div className="flex justify-between w-screen items-center py-4 px-7">
                    <div className="text-2xl font-semibold">Profile</div>
                    <div className="flex gap-3 justify-center items-center">
                        <Link href="/forgot" className="p-2 rounded-lg bg-slate-600 font-semibold hover:bg-slate-700 transition-all duration-300 text-lg">Change Password</Link>
                        <button onClick={onLogout} disabled={isButtonDisabled} className={`p-2 rounded-lg bg-orange-500 font-semibold hover:bg-orange-700 transition-all text-black hover:text-white duration-300 text-lg ${isButtonDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>{isButtonDisabled ? "Logging Out" : "Logout"}</button>
                    </div>

                </div>
                <div className="mt-24 border-4 border-gray-500 p-6 bg-slate-950 rounded-lg text-xl flex flex-col justify-center gap-5">
                    <h1><span className="font-semibold">UUID</span> : <Link href={`/profile/${data._id}`}>{data._id}</Link></h1>
                    <p><span className="font-semibold">Email</span> : <span>{data.email}</span></p>
                    <p><span className="font-semibold">Username</span> : <span>{data.username}</span></p>
                    <p><span className="font-semibold">Verified</span> : {data.isVerified ? <span>Yes</span> : <Link href="/verifyemail">No</Link>}</p>
                </div>
            </div>
        </>
    )
}