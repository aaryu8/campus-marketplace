import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { hashPassword, comparePasswords } from "./actions/passwordRelated.js";
import { prisma } from "./db.js"
import { signinformInput, signupformInput, productSchema } from './schema.js';
import crypto from 'crypto'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import type { User as userSchema } from '@prisma/client';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(session({
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax'
    }
}));


declare module 'express-session' {
    interface SessionData {
        userId: string,
        name: string,
        email: string,
    }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).send({ msg: "YOU ARE NOT LOGGED IN" });
    }
    next();
}

// ✅ Promisified session creation
function createSession(req: Request, user: userSchema): Promise<void> {
    return new Promise((resolve, reject) => {
        req.session.userId = user.id;
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const port = 4000;

app.post("/createListing", requireAuth, async (req: Request, res: Response) => {
    try {
        const rawData = req.body;
        const { success, data } = productSchema.safeParse(rawData);

        if (!success) {
            return res.status(400).send({
                msg: "Invalid data format"
            });
        }

        const { title, price, description, image } = data;
        const userId = req.session.userId;
        
        const user = await prisma.user.findUnique({
            where: { id: userId! }
        });

        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }

        const product = await prisma.product.create({
            data: {
                title,
                price: parseInt(price, 10),
                description,
                category: "general",
                image,
                ownerId: user.id
            }
        });

        console.log("Product created:", product);

        return res.status(201).send({
            taskStatus: true,
            product
        });

    } catch (error) {
        console.error("Error creating listing:", error);
        return res.status(500).send({ msg: "Internal server error" });
    }
});

app.get("/marketplace" ,  async (req : Request , res : Response) => {
    try {
        console.log("IT is coming ot this route don't worry");
        const products = await prisma.product.findMany();
        return res.status(200).send(products);
    } catch (error){
        console.error(error);
    }
})


app.get("/marketplace/productInfo" ,  async(req : Request ,res: Response)=> {
    try {
        console.log("GOT TILL HERE");
        const userName = req.session.name;
        const userEmail = req.session.email;

        const { productId } = req.body;
        console.log(req.body);
        console.log(productId);
        const productInfo = await prisma.product.findUnique({
            where : {
                id : productId
            },
            select : {
                title : true,
                price : true,
                description : true,
                rating : true,
                category : true,
                condition : true,
                image : true,
                createdAt : true,
                owner : {
                    select : {
                        name : true,
                        email : true
                    }
                }
            }
        })
        
        console.log(productInfo!.owner);

        res.status(200).send({
            taskStatus : true,
            data : {
                productInfo
            }
        });

    } catch (error){
        console.error(error);
        return res.send({
            taskStatus : false,
            msg : "Could Not fetch product information"
        })
    }
})


app.get('/me', async (req: Request, res: Response) => {
    try {
        const userId = req.session.userId;
        
        if (!userId) {
            return res.status(401).send({
                LoggedIn: false,
                user: {
                    id: null,
                    name: null,
                    email: null
                }
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).send({
                LoggedIn: false,
                user: null
            });
        }

        return res.status(200).send({
            LoggedIn: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error in /me:", error);
        return res.status(500).send({ msg: "Internal server error" });
    }
});

app.post('/sign-up', async (req: Request, res: Response) => {
    try {
        const rawData = req.body;
        const { success, data } = signupformInput.safeParse(rawData);
        
        if (!success) {
            return res.status(400).send({
                authStatus: false,
                msg: "Invalid input data"
            });
        }

        const { name, email, password } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).send({
                authStatus: false,
                msg: "User already exists, please sign in"
            });
        }

        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = await hashPassword(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                salt
            },
        });

        console.log("User created:", user.id);

        // ✅ Wait for session to save
        await createSession(req, user);

        return res.status(201).send({
            authStatus: true,
            msg: "User created successfully"
        });

    } catch (error) {
        console.error("Error in sign-up:", error);
        return res.status(500).send({
            authStatus: false,
            msg: "Internal server error"
        });
    }
});

app.post('/sign-in', async (req: Request, res: Response) => {
    try {
        const { success, data } = signinformInput.safeParse(req.body);
        
        if (!success) {
            return res.status(400).send({
                authStatus: false,
                msg: "Invalid input data"
            });
        }

        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).send({
                authStatus: false,
                msg: "User not found. Please sign up first"
            });
        }

        const isPasswordValid = await comparePasswords(password, user.salt, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({
                authStatus: false,
                msg: "Incorrect password"
            });
        }

        // ✅ Wait for session to save
        await createSession(req, user);
        
        console.log("User logged in:", req.session.userId);

        return res.status(200).send({
            authStatus: true,
            msg: "Login successful"
        });

    } catch (error) {
        console.error("Error in sign-in:", error);
        return res.status(500).send({
            authStatus: false,
            msg: "Internal server error"
        });
    }
});

app.post('/logout', async (req: Request, res: Response) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send({ msg: "Failed to log out" });
        }

        res.clearCookie("connect.sid");
        return res.status(200).send({ msg: "Logged out successfully" });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});