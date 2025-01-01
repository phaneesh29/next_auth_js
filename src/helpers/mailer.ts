import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 })
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 })

        }


        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: "codepenny24@gmail.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: emailType === "VERIFY" ? (`<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`) : (`<p>Click <a href="${process.env.DOMAIN}/changepassword?token=${hashedToken}">here</a> to reset your password
                or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/changepassword?token=${hashedToken}
                </p>`)
        }

        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse

    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
}

