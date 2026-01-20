import { Router } from 'express';
import { createListingHandler, getProductsHandler, getProductHandler } from '../actions/marketplaceHandlers.js';

const router = Router();

router.post("/createListing", createListingHandler);
router.get("/", getProductsHandler);
router.get("/:productId", getProductHandler);

export default router;
