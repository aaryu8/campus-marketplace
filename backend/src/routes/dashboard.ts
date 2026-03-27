import { Router } from "express";
import { profileHandler, updateprofileHandler, changePasswordHandler , meHandler } from "../actions/userHandlers.js";
import { requireAuth } from "../middlewarecheck.js";

const router = Router();

router.get("/me" , requireAuth , meHandler);
router.get("/profile/me",              requireAuth, profileHandler);
router.patch("/profile/me",            requireAuth, updateprofileHandler);
router.post("/change-password", requireAuth, changePasswordHandler);


export default router;