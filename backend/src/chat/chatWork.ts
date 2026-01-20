import { Router, type Request, type Response } from 'express';
import z from "zod";
import { v5 as uuidv5 } from "uuid";

const router = Router();

const DataFormat = z.object({
    buyerId : z.string(),
    sellerId : z.string()
})

const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

function generateChatId(buyerId: string, sellerId: string): string {
    // Sort IDs so order doesn't matter
    const [idA, idB] = [buyerId, sellerId].sort();
    const combined = `${idA}-${idB}`;
    // Generate UUIDv5 from the combined string
    return uuidv5(combined, NAMESPACE); 
}



router.post('/createID' , (req : Request , res : Response)=> {
    try {
        const rawData = req.body;
        const {success , data} = DataFormat.safeParse(rawData);

        if(!success){
            return res.status(400).send({
                status : false,
                msg : "Invalid Data send"
            })
        }

        const {buyerId , sellerId} = data;
        
        const chatId = generateChatId(buyerId , sellerId);

        return res.status(200).send({
            status : true,
            data : chatId
        })


    } catch (error){
        console.error(error);
        return res.status(404).send({
            status : false,
            msg : "Could not complete the required task at the moment"
        })
    }
} )


export default router;