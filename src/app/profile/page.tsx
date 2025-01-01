"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter()
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

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

    return (
        <>
            <Toaster />
            <div className="flex justify-between items-center py-4 px-7">
                <div className="text-2xl font-semibold">Profile</div>
                <button onClick={onLogout} disabled={isButtonDisabled} className={`p-2 rounded-lg bg-orange-500 hover:bg-orange-700 transition-all text-black hover:text-white duration-300 text-lg ${isButtonDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}>{isButtonDisabled ? "Logging Out" : "Logout"}</button>
            </div>
        </>
    )
}