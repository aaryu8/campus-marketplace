// handlers/listingHandler.ts
// Only the updateListingHandler changes — added moderation guard.
// getListingHandler and deleteListingHandler are unchanged.

import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import type { Category, Condition, ProductStatus } from "@prisma/client";

// ─── Validation ───────────────────────────────────────────────────────────────

const updateListingSchema = z.object({
  title:       z.string().min(3).max(80).transform((s) => s.trim()).optional(),
  price:       z.union([z.string(), z.number()]).transform((v) => Number(v)).refine((n) => Number.isFinite(n) && n >= 0).optional(),
  description: z.string().min(10).max(1000).transform((s) => s.trim()).optional(),
  category:    z.enum(["general","books","electronics","furniture","clothes","food","sports","transport","hostel"]).optional(),
  condition:   z.enum(["new","like_new","good","fair","poor"]).optional(),
  // "paused" removed — status is now only active | sold
  status:      z.enum(["active","sold"]).optional(),
  image:       z.array(z.string().min(1)).max(5).optional(),
});

// ─── GET single listing (owner only) ─────────────────────────────────────────

export async function getListingHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user?.id as string | undefined;
    const id     = req.params.id as string;

    const product = await prisma.product.findUnique(
      { 
        where: { id },
        include: {
          owner : {
            select : {
              name : true,
            }
          }
        }
      }
    );

    if (!product)                   return res.status(404).json({ msg: "Listing not found" });
    if (product.ownerId !== userId) return res.status(403).json({ msg: "Forbidden" });

    return res.status(200).json({ product });
  } catch (error) {
    console.error("getListingHandler error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// ─── PATCH listing ────────────────────────────────────────────────────────────

export async function updateListingHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user?.id as string | undefined;
    const id     = req.params.id as string;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing)                    return res.status(404).json({ msg: "Listing not found" });
    if (existing.ownerId !== userId)  return res.status(403).json({ msg: "Forbidden" });

    // ── Moderation guard ──────────────────────────────────────
    // Suspended listings are locked — seller cannot edit or change status.
    // They must file a dispute first via POST /api/marketplace/:productId/dispute.
    if (existing.moderationStatus === 'suspended') {
      return res.status(403).json({
        msg: "This listing is suspended and cannot be edited. File a dispute to contest it.",
        moderationStatus: 'suspended',
      });
    }

    const parsed = updateListingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ msg: "Invalid data", errors: parsed.error.flatten().fieldErrors });
    }

    const { title, price, description, category, condition, status, image } = parsed.data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(title       !== undefined && { title }),
        ...(price       !== undefined && { price }),
        ...(description !== undefined && { description }),
        ...(category    !== undefined && { category:  category  as Category }),
        ...(condition   !== undefined && { condition: condition as Condition }),
        ...(status      !== undefined && { status:    status    as ProductStatus }),
        ...(image       !== undefined && { image }),
        updatedAt: new Date(),
      },
      select: {
        id: true, title: true, price: true,
        category: true, condition: true, status: true,
        moderationStatus: true, image: true, updatedAt: true,
      },
    });

    return res.status(200).json({ taskStatus: true, product });
  } catch (error) {
    console.error("updateListingHandler error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

// ─── DELETE listing ───────────────────────────────────────────────────────────

export async function deleteListingHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user?.id as string | undefined;
    const id     = req.params.id as string;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing)                    return res.status(404).json({ msg: "Listing not found" });
    if (existing.ownerId !== userId)  return res.status(403).json({ msg: "Forbidden" });

    await prisma.product.delete({ where: { id } });

    return res.status(200).json({ taskStatus: true, msg: "Listing deleted" });
  } catch (error) {
    console.error("deleteListingHandler error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}