import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const mongoConnect = async () =>
{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb is connected");
    } catch (error) {
        console.error("failed connecting to mongodb:", error)
        process.exit()
    }
}

export default mongoConnect