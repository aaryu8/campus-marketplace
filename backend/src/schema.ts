
import z from "zod"


export const signupformInput = z.object({
    name : z.string() , 
    email : z.string(),
    password : z.string(),
    college : z.enum([
                "MAIT",
                "DTU",
                "IITD",
                "GGSIPU",
                "MSIT",
                "NSUT",
                "IIITD",
                "BVCOE"
                ]),
    branch : z.enum([
                "CSE", 
                "IT" ,
                "ECE",
                "EEE" ,
                "ME" ,
                "CE",
                "BT",
                "CHE",
                "MAC",
                "NotSpecified"
                ]),
    year : z.number()
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
