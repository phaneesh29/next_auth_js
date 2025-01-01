"use client"

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const errorNotify = (msg: string) => toast.error(msg, {
        position: "top-center",
        duration: 4000,
    });

    const successNotify = (msg: string) => toast.success(msg, {
        position: "top-center",
        duration: 4000,
    });

    const verifyUserEmail = async () => {
        try {
            const response = await axios.post('/api/users/verifyemail', { token })
            successNotify(response.data.message);
            setVerified(true);
        } catch (error: any) {
            errorNotify(error?.response?.data?.message || "Error verifying email");
            setError(true);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center gap-16 min-h-screen py-2">
            <Toaster />

            <h1 className="text-4xl font-semibold">Verify Email</h1>
            <h2 className=" p-2 font-semibold bg-orange-700 text-white text-base rounded-lg hover:bg-red-800 transition-all duration-300">{token ? `${token}` : "No token"}</h2>

            {verified && (
                <div className="text-center bg-green-600 text-gray-950 font-semibold p-5 rounded-lg">
                    <h2 className="text-3xl mb-4">Email Verified</h2>
                    <Link href="/login" className="text-lg bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-950 transition-all duration-300">
                        Login
                    </Link>
                </div>
            )}

            {error && (
                <div>
                    <h2 className="text-2xl bg-red-800 p-4 rounded-lg">An error occured</h2>
                </div>
            )}
        </div>
    )
}
