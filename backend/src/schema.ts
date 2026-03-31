
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
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(80, "Title must be under 80 characters")
    .transform((s) => s.trim()),
  
  price: z
    .union([z.string(), z.number()])
    .transform((v) => Number(v))
    .refine((n) => Number.isFinite(n) && n >= 0, "Price must be a non-negative number"),
  
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be under 1000 characters")
    .transform((s) => s.trim()),
  
  category: z.enum([
    "general",
    "books",
    "electronics",
    "furniture",
    "clothes",
    "food",
    "sports",
    "transport",
    "hostel",
  ], { 
    error: "Invalid category" // Use 'error' or 'message' here, NOT errorMap
  }),
  
  condition: z
    .enum(["new", "like_new", "good", "fair", "poor"], {
      error: "Invalid condition", // Use 'error' or 'message' here
    })
  ,
  image: z
    .array(z.string().min(1))
    .max(5, "Maximum 5 images allowed")
    .default([]),
});