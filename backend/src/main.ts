import express  from 'express';
import type { NextFunction, Request , Response}  from 'express';
import cors from 'cors';
import { hashPassword , comparePasswords  } from "./actions/passwordRelated.js";
import { prisma  } from "./db.js"
import { signinformInput , signupformInput } from './schema.js';
import crypto from 'crypto'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import type { User as userSchema }  from '@prisma/client';
import { ppid } from 'process';
const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
    optionsSuccessStatus: 204
}));

app.use(cookieParser());
app.use(express.json());


// ek session expire ka kuch banana hai 


app.use(session({
    secret : process.env.SECRET_KEY!,
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : process.env.NODE_ENV == "production",
        httpOnly : true,
        maxAge : 60 * 60 * 24 * 7,
        sameSite : 'lax'
    }
}))


declare module 'express-session' {
    interface SessionData {
        userId : string,
        name : string,
        email : string ,
    }
}


function requireAuth(req : Request , res : Response , next : NextFunction){
    const userId = req.session.userId;
    if(!userId){
        return res.status(401).send("YOU ARE NOT LOGGED IN");
    }
    next();
}



function createSession(req : Request , res : Response , user : userSchema ){
    req.session.userId = user.id;
}


/** RIGHT NOW 
 * ek sessionId banani hai (using crypto), store it in redis , 
 * make a cookie with the sessionId     
 */

/** DATA TYPE
 *  { name: 'a', email: 'ar.akku2005@gmail.com', password: 'asdfasdf' }
*/

/** TO DO LIST
 * in password make sure no one enters a space
 * 
 */

const port = 4000;


app.get('/me'  , async(req : Request , res: Response) => {
    const userId = req.session.userId;
    if (!userId) {
        res.status(401).send(
            { 
                LoggedIn : false,
                user : {
                    id : null,
                    name : null,
                    email: null
                }
            }
        );
    }
    
    const user = await prisma.user.findUnique({
        where : {
            id : userId!
        }
    })

    res.status(200).send({
        LoggedIn : true,
        user : {
            id : user?.id,
            name : user?.name,
            email : user?.email
        } 
    });
})



app.post('/sign-up' , async (req : Request , res : Response) => {
    
    const rawData = req.body;
    const {success , data} = signupformInput.safeParse(rawData);
    if(!success){
        res.send({
            authStatus : false,
            msg : "Unable to Create Account"
        });
    }


    const {name , email , password } = rawData;
    const check = await prisma.user.findUnique({
        where : {
            email : email
        }
    })

    if(check){
        res.send({
            authStatus : false,
            msg : "User Already Exists , go to sign in page"
        });
    }


    // USER PASSWORD AND EVERYTHING IS SOTRED AFTERWARDS FIRST SEND OTP AND CONFIRM WITH THE MAIL 
    //IF VERIFIED THEN THE PROCESS FURTHER CONTINUES;   

    const otp = crypto.randomInt(100000 , 999999).toString();


    const salt =  crypto.randomBytes(16).toString("hex").normalize();
    const hashedPassword = await hashPassword(password , salt);




    const user = await prisma.user.create({
        data : {
           name : name,
           email : email ,
           password : hashedPassword ,  
           salt : salt
        },
    })

    console.log(user);




    createSession(req , res , user);
    console.log(req.session.userId);
    res.status(200).send({
        authStatus : true,
        msg : "User Created"
    });
})


app.post('/sign-in' ,  async (req : Request , res : Response) => {

    const {success , data } = signinformInput.safeParse(req.body);
    if(!success){
        res.send({
            authStatus : false,
            msg : "UNABLE TO LOG IN "
        });
    }

    const {email  , password  } = req.body;

    const user = await prisma.user.findUnique({
        where : {
            email : email
        }
    })

    if(!user){
        res.send({
            authStatus : false,
            msg : "YOU HAVEN'T SIGNED UP YET"
        });
        return;
    } 
    
    console.log(password);
    console.log(user.password);
    const result = await comparePasswords(password , user.salt, user.password );
    
    if(!result){
        res.send("WRONG PASSWORD");
    }


    createSession(req , res , user);
    console.log(req.session.userId);
    res.status(200).send({
        authStatus : true,
        msg : "USER LOGGED IN"
    })
})


app.post('/logout' , async (req : Request , res : Response) => {
    req.session.destroy(err=> {
        if(err) {
            console.error(err);  
            return res.status(500).send("Failed to log out"); 
        }

        res.clearCookie("connect.sid");
        res.send("Logged OUT");
        res.redirect("/");
    })
})




app.listen(port, () => {
    console.log("First Time running backend ")
})



