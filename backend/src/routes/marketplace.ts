import { Router, type NextFunction, type Request, type Response } from 'express';
import { createListingHandler, getProductsHandler, getProductHandler, trackProductView } from '../actions/marketplaceHandlers.js';
import {requireAuth} from "../middlewarecheck.js"
import { disputeReportHandler, reportProductHandler } from '../handlers/reportHandler.js';
import '../cron/moderation.js';
const router = Router();




router.post("/createListing", requireAuth , createListingHandler);
router.get("/", getProductsHandler);
router.get("/:productId", getProductHandler);
router.post("/:productId/view" , trackProductView);
router.post("/:productId/report",  requireAuth, reportProductHandler);
router.post("/:productId/dispute", requireAuth, disputeReportHandler);


export default router;
