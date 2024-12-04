import mongoose from "mongoose";
import { M } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB(){
    try {
        console.log(MONGODB_URI)
        const res = await mongoose.connect(MONGODB_URI);
        console.log("connection done")
        return res
    } catch (error) {
        console.log("error at connection DB",error);
        throw error;
    }
}

export { connectDB };
