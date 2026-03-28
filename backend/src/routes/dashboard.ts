import { Router } from "express";
import { profileHandler, updateprofileHandler, changePasswordHandler , meHandler } from "../actions/userHandlers.js";
import { requireAuth } from "../middlewarecheck.js";
import { deleteListingHandler, getListingHandler, updateListingHandler } from "../actions/listingHandlers.js";

const router = Router();

router.get("/me" , requireAuth , meHandler);
router.get("/profile/me",              requireAuth, profileHandler);
router.patch("/profile/me",            requireAuth, updateprofileHandler);
router.post("/change-password", requireAuth, changePasswordHandler);
router.get("/listings/:id",    requireAuth, getListingHandler);
router.patch("/listings/:id",  requireAuth, updateListingHandler);
router.delete("/listings/:id", requireAuth, deleteListingHandler);

export default router;