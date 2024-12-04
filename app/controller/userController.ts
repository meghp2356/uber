import { User } from "~/models/user.server";
import { createUser } from "~/service/userService";

interface registerUser{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
}

export const registerUser = async( {firstName,lastName,email,password} : registerUser)=>{
    if (!firstName || !email || !password) {
        throw new Error("All fields are required");
    }

    const hashedPassword = await User.hashPassword(password)

    const user = await createUser({firstName, lastName, email, password:hashedPassword})

    const data = await User.findById(user._id).select("fullName email password")

    const {accessToken , refreshToken } = await user.genAuthToken()

    return {data,accessToken,refreshToken}
}