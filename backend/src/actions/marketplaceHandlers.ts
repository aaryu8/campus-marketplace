import type { Request, Response } from "express";
import { prisma } from "../db.js";
import { productSchema } from "../schema.js";
import { ensureAnonymousSession } from "./session.js"
import { redisClient } from '../redis/redis.js'

export async function createListingHandler(req: Request, res: Response) {
    try {
        const userInfo = res.locals.user;
        const rawData = req.body;

        console.log(`Here is the information regarding user :- ${userInfo}`);

        const { success, data } = productSchema.safeParse(rawData);
        if (!success) {
            return res.status(400).send({ msg: "Invalid data format" });
        }

        const { title, price, description, image } = data;
        const userId = userInfo.id;

        const user = await prisma.user.findUnique({ where: { id: userId! } });
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

        return res.status(201).send({ taskStatus: true, product });

    } catch (error) {
        console.error("Error creating listing:", error);
        return res.status(500).send({ msg: "Internal server error" });
    }
}



export async function getProductsHandler(req: Request, res: Response) {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).send(products);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ msg: "Internal server error" });
    }
}


export async function getProductHandler(req: Request, res: Response) {
    try {
        const { productId } = req.params;
        
        const sessionId = await ensureAnonymousSession(req, res);

        const todayKey = `view:${productId}:${new Date().toISOString().slice(0, 10)}`; // Set of sessionIds
        const counterKey = `view_count:${productId}:${new Date().toISOString().slice(0, 10)}`; // Counter

        // Deduplicate: only count once per session
        const hasViewed = await redisClient.sismember(todayKey, sessionId);

        // Upstash Redis returns number for sismember: 0 = not exists, 1 = exists
        if (hasViewed === 0) {
        // Add sessionId to set
        await redisClient.sadd(todayKey, sessionId);
        await redisClient.expire(todayKey, 60 * 60 * 12); // 12 hours, adjustable

        // Increment total views for the period
        await redisClient.incr(counterKey);
        await redisClient.expire(counterKey, 60 * 60 * 12);
        }

        // Safe parsing for viewsToday
        const redisValue = await redisClient.get(counterKey);

        // TypeScript-safe cast: convert unknown -> string
        const redisValueStr = typeof redisValue === 'string' ? redisValue : '0';
        const viewsToday = parseInt(redisValueStr, 10);

        console.log('Views today for product', productId, ':', viewsToday);


        const productInfo = await prisma.product.findUnique({
            where: { id: productId! },
            select: {
                title: true,
                price: true,
                description: true,
                rating: true,
                category: true,
                condition: true,
                image: true,
                createdAt: true,
                // Add createdAt here inside the owner select
                owner: { 
                    select: { 
                        id: true, 
                        name: true, 
                        email: true,
                        createdAt: true // This allows the "Member since" logic to work
                    } 
                }
            }
        });

        if (!productInfo) {
            return res.status(404).send({ taskStatus: false, msg: "Product not found" });
        }

        return res.status(200).send({ taskStatus: true, data: { productInfo } });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ taskStatus: false, msg: "Could Not fetch product information" });
    }
}