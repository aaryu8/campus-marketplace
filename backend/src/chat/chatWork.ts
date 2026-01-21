import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { v5 as uuidv5 } from 'uuid';
import { prisma } from '../db.js';

const router = Router();

const DataFormat = z.object({
    buyerId: z.string(),
    sellerId: z.string(),
    productId: z.string() // ✅ Add productId
});

const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

function generateChatId(buyerId: string, sellerId: string): string {
    const [idA, idB] = [buyerId, sellerId].sort();
    const combined = `${idA}-${idB}`;
    return uuidv5(combined, NAMESPACE);
}

// Create or get conversation
router.post('/createId', async (req: Request, res: Response) => {
    try {
        const rawData = req.body;
        const { success, data } = DataFormat.safeParse(rawData);

        if (!success) {
            return res.status(400).send({
                status: false,
                msg: "Invalid Data sent"
            });
        }

        const { buyerId, sellerId, productId } = data;

        // Generate consistent chatId
        const chatId = generateChatId(buyerId, sellerId);

        // Check if conversation exists in database
        let conversation = await prisma.conversation.findFirst({
            where: {
                id: chatId,
                productId,
                buyerId,
                sellerId
            }
        });

        // Create if doesn't exist
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    id: chatId, // ✅ Use your generated UUID
                    productId,
                    buyerId,
                    sellerId
                }
            });
        }

        console.log({
            msg : "CHATID AUR CONVERSATION BAN RAHI HAI DON'T WORRY AND FORWARD KAR DI HAI ",
            conversation
        })

        return res.status(200).send({
            status: true,
            data: chatId
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: false,
            msg: "Could not complete the required task at the moment"
        });
    }
});

// Get conversation details
router.get('/conversation/:chatId', async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        
        if(!chatId){
            return res.status(400).send({
                status : false,
                msg : "Could Not fetch at the moment"
            })
        }
        console.log(`HERE COMES TO CHAT ID IN TEH CONVERSATION ROUTE${chatId}`)
        const conversation = await prisma.conversation.findUnique({
            where: { id: chatId },
            include: {
                product: {
                    select: {
                        id: true,
                        title: true,
                        image: true,
                        price: true
                    }
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!conversation) {
            return res.status(404).send({
                status: false,
                msg: "Conversation not found"
            });
        }

        return res.status(200).send({
            status: true,
            conversation
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: false,
            msg: "Failed to fetch conversation"
        });
    }
});

export default router;