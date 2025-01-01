import mongoose from "mongoose";

export async function connect() {
    try {

        await mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on("connected", () => {
            console.log("MONGODB Connected! Suiii")
        })
        connection.on("error", (err) => {
            console.log("MONGODB Error")
            console.log(err)
            process.exit()
        })

    } catch (error) {
        console.log("Something Went Wrong")
        console.log(error)
    }
}