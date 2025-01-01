import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (requsest: NextRequest) => {
    try {
        const token = requsest.cookies.get("token")?.value || ""
        const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!)

        if (!decodedToken) {
            throw new Error("Invalid token")
        }

        return decodedToken.id

    } catch (error: any) {
        throw new Error(error.message)
    }
}