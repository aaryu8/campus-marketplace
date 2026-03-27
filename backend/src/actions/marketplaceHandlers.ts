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
        
        const productInfo = await prisma.product.findUnique({
            where: { id: productId! },
            select: {
                title: true,
                price: true,
                description: true,
                rating: true,
                views: true,      // ← add this
                category: true,
                condition: true,
                image: true,
                createdAt: true,
                owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true
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


// POST /api/marketplace/:productId/view
export async function trackProductView(req: Request, res: Response) {
  try {
    const { productId } = req.params;

    // Read from header — sent by TrackView
    const sessionId = req.headers['x-session-id'] as string;

    if (!sessionId) {
      return res.status(400).json({ ok: false, reason: 'no session' });
    }

    console.log("📍 /view hit — sessionId:", sessionId.slice(0, 20) + "...");

    // In trackProductView on Express
    const today = new Date().toISOString().slice(0, 10);
    const todayKey = `view:${productId}:${today}`;
    const counterKey = `view_count:${productId}:${today}`;

    // SADD returns 1 if the element was NEW, 0 if it already existed
    // This is atomic — no race condition possible
    const isNewView = await redisClient.sadd(todayKey, sessionId) as number;
    await redisClient.expire(todayKey, 60 * 60 * 12);

    if (isNewView === 1) {
    // Only increment if this sessionId was genuinely new
    await redisClient.incr(counterKey);
    await redisClient.expire(counterKey, 60 * 60 * 12);
    }

    return res.status(200).json({ ok: true, alreadyViewed: isNewView === 0 });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false });
  }
}