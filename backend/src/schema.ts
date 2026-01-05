import { connect } from "http2"
import z from "zod"

export const signupformInput = z.object({
    name : z.string() , 
    email : z.string(),
    password : z.string() 
})

export const signinformInput = z.object({
    email : z.string(),
    password : z.string()
})

export const productSchema = z.object({
    title : z.string(),
    price : z.string(),
    description : z.string(),
    image : z.array(z.string()),
})
