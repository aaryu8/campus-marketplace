import type { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../db.js";
import { hashPassword, comparePasswords } from "../actions/passwordRelated.js";
import { getUserfromSession } from "../actions/session.js";


export async function meHandler(req: Request, res: Response) {
  try {
    const userInfo = res.locals.user;
    if (!userInfo?.id) {
      return res.status(401).json({ error: "User not authenticated or ID missing" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userInfo.id },
      select: {
        id:         true,
        name:       true,
        email:      true,
        college:    true,
        branch:     true,
        year:       true,
        createdAt:  true,
        totalViews: true,
        trustScore: true,

        _count: {
          select: {
            products:            true,
            buyerConversations:  true,
            sellerConversations: true,
          },
        },

        products: {
          select: {
            id:               true,
            title:            true,
            price:            true,
            status:           true,
            moderationStatus: true,
            reportWeight:     true,
            views:            true,
            image:            true,
          },
        },
      },
    });

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Separate by status and moderationStatus
    const activeProducts      = user.products.filter(p => p.status === 'active' && p.moderationStatus !== 'suspended');
    const soldProducts        = user.products.filter(p => p.status === 'sold');
    const underReviewProducts = user.products.filter(p => p.moderationStatus === 'suspended');

    const dashboardData = {
      profile: {
        name:       user.name,
        email:      user.email,
        college:    user.college,
        branch:     user.branch,
        year:       user.year,
        totalViews: user.totalViews,
        trustScore: user.trustScore,
        joined:     user.createdAt,
      },
      stats: {
        totalViews:        user.totalViews,
        activeListings:    activeProducts.length,
        soldItems:         soldProducts.length,
        underReview:       underReviewProducts.length,
        totalConversations: user._count.buyerConversations + user._count.sellerConversations,
      },
      items: {
        active:      activeProducts,
        sold:        soldProducts,
        underReview: underReviewProducts,
      },
    };

    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error in GET /dashboard/me:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}






// GET /api/user/me — return full profile for the logged-in user
export async function profileHandler(req: Request, res: Response) {
    try {
        const userInfo = res.locals.user;


        const user = await prisma.user.findUnique({
            where: { id: userInfo.id },
            select: {
                id:        true,
                name:      true,
                email:     true,
                college:   true,
                branch:    true,
                year:      true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).send({ msg: "User not found" });
        }

        // matches what the frontend reads: res.data.user
        return res.status(200).send({ LoggedIn: true, user });

    } catch (error) {
        console.error("Error in GET /user/me:", error);
        return res.status(500).send({ msg: "Internal server error" });
    }
}

// PATCH /api/user/me — update name, college, branch, year
export async function updateprofileHandler(req: Request, res: Response) {
    try {
       const userInfo = res.locals.user;

        const { name, college, branch, year } = req.body;

        const updated = await prisma.user.update({
            where: { id: userInfo.id },
            data: {
                ...(name    !== undefined && { name }),
                ...(college !== undefined && { college }),
                ...(branch  !== undefined && { branch }),
                ...(year    !== undefined && { year }),
            },
            select: {
                id:      true,
                name:    true,
                email:   true,
                college: true,
                branch:  true,
                year:    true,
            },
        });

        return res.status(200).send({ taskStatus: true, user: updated });

    } catch (error) {
        console.error("Error in PATCH /user/me:", error);
        return res.status(500).send({ msg: "Internal server error" });
    }
}

// POST /api/user/change-password
export async function changePasswordHandler(req: Request, res: Response) {
    try {
        const session = await getUserfromSession(req);
        if (!session) {
            return res.status(401).send({ msg: "Unauthorized" });
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).send({ msg: "Both passwords are required." });
        }

        if (newPassword.length < 8) {
            return res.status(400).send({ msg: "New password must be at least 8 characters." });
        }

        const user = await prisma.user.findUnique({ where: { id: session.id } });
        if (!user) {
            return res.status(404).send({ msg: "User not found." });
        }

        // uses your existing comparePasswords — not bcrypt
        const isValid = await comparePasswords(currentPassword, user.salt, user.password);
        if (!isValid) {
            return res.status(401).send({ msg: "Current password is incorrect." });
        }

        const newSalt       = crypto.randomBytes(16).toString("hex");
        const hashedPassword = await hashPassword(newPassword, newSalt);

        await prisma.user.update({
            where: { id: session.id },
            data:  { password: hashedPassword, salt: newSalt },
        });

        return res.status(200).send({ taskStatus: true, msg: "Password updated successfully." });

    } catch (error) {
        console.error("Error in POST /user/change-password:", error);
        return res.status(500).send({ msg: "Internal server error" });
    }
}