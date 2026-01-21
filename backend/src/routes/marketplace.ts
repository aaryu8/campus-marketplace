import { Router, type NextFunction, type Request, type Response } from 'express';
import { createListingHandler, getProductsHandler, getProductHandler } from '../actions/marketplaceHandlers.js';
import { getUserfromSession } from '../actions/session.js';


const router = Router();

async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const userInfo = await getUserfromSession(req);
    if (!userInfo) {
        return res.status(401).send({ msg: "YOU ARE NOT LOGGED IN" });
    }
    console.log(userInfo);
    res.locals.user = userInfo;
    next();
}


router.post("/createListing", requireAuth , createListingHandler);
router.get("/", getProductsHandler);
router.get("/:productId", getProductHandler);

export default router;
