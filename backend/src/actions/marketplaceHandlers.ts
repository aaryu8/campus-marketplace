import type { Request, Response } from "express";
import { prisma } from "../db.js";
import { productSchema } from "../schema.js";
import { redisClient } from '../redis/redis.js'

export async function createListingHandler(req: Request, res: Response) {
  try {
    // requireAuth middleware sets res.locals.user
    const userInfo = res.locals.user;
    if (!userInfo?.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
 
    // ── Validate ──────────────────────────────────────────────────
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        msg: "Invalid data",
        errors: parsed.error.flatten().fieldErrors,
      });
    }
 
    const { title, price, description, category, condition, image } = parsed.data;
 
    // ── Confirm user exists ───────────────────────────────────────
    const user = await prisma.user.findUnique({ where: { id: userInfo.id } });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
 
    // ── Create product ────────────────────────────────────────────
    const product = await prisma.product.create({
      data: {
        title,
        price,
        description,
        category,
        condition,
        image,
        status: "active",
        ownerId: user.id,
      },
      // Return enough for the frontend redirect
      select: {
        id: true,
        title: true,
        price: true,
        category: true,
        condition: true,
        status: true,
        image: true,
        createdAt: true,
      },
    });
 
    return res.status(201).json({ taskStatus: true, product });
 
  } catch (error) {
    console.error("Error creating listing:", error);
    return res.status(500).json({ msg: "Internal server error" });
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