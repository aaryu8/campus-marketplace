import { Router, type NextFunction, type Request, type Response } from 'express';
import { createListingHandler, getProductsHandler, getProductHandler } from '../actions/marketplaceHandlers.js';
import {requireAuth} from "../middlewarecheck.js"

const router = Router();




router.post("/createListing", requireAuth , createListingHandler);
router.get("/", getProductsHandler);
router.get("/:productId", getProductHandler);

export default router;
