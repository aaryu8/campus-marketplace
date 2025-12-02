import crypto from 'crypto'
import { scrypt } from "crypto";


export function hashPassword(password : string , salt : string): Promise<string>{
    return new Promise((resolve, reject) => {
        scrypt(password.normalize() , salt , 64 , (error , hash)=> {
            if (error )   reject(error)
            resolve(hash.toString("hex").normalize());
        })
    })
}


export async function comparePasswords(enteredPassword : string , salt : string , storedPassword : string){
    const inputhashedPassword = await hashPassword(enteredPassword , salt);
    return crypto.timingSafeEqual(
        Buffer.from(inputhashedPassword , "hex"),
        Buffer.from(storedPassword , "hex")
    )
}
