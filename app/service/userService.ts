import { User } from "~/models/user.server";

interface createUser{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
}

export const createUser = async({firstName,lastName,email,password} : createUser)=>{
    if (!firstName || !email || !password) {
        throw new Error("All fields are required");
    }

    const user = User.create({
        fullName:{ firstName , lastName},
        email,
        password
    })

    return user;
}