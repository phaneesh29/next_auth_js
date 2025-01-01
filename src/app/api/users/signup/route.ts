import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { NextRequest, NextResponse } from "next/server"
import bcryptjs from "bcryptjs"
import { sendEmail } from "@/helpers/mailer"
connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody

        if (!username || !email || !password) {
            return NextResponse.json({ error: "All fields required" }, { status: 400 })
        }

        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json({ error: "User already exist" }, { status: 400 })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            email,
            username,
            password: hashedPassword
        })

        const savedUser = await newUser.save()

        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })

        return NextResponse.json({
            message: "User created, check your email to verify account",
            success: true,
            savedUser
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}