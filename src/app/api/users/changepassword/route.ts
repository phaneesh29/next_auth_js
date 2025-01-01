import { connect } from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/userModel"
import bcryptjs from 'bcryptjs'

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token, password, confirmPassword } = reqBody

        if (!token) {
            return NextResponse.json({ error: "No token provided" }, { status: 400 })
        }
        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
        }

        const user = await User.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } })
        if (!user) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        user.password = hashedPassword
        user.forgotPasswordToken = undefined
        user.forgotPasswordTokenExpiry = undefined
        await user.save();
        return NextResponse.json({
            message: "Password changed successfully",
            success: true
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}