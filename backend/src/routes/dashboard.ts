import { Router, type NextFunction, type Request, type Response } from 'express';
import {requireAuth} from "../middlewarecheck.js"
import { prisma } from "../db.js";

const router = Router();


router.post("/", requireAuth , async (req : Request , res : Response) => {
    try {

        const userInfo = res.locals.user;
        const userId = userInfo.userId;

        const user = await prisma.user.findUnique({ 
            where: { id: userId! }, 
            select: {
                name : true,
                email : true,
                createdAt : true,
                totalViews : true,
                products : true,
                
            }
         });

        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }


        return res.status(200).send(user);


    } catch {

    }
});

export default router;
