import { Router } from 'express';
import { signUpHandler, signInHandler, logoutHandler, meHandler } from '../actions/authHandlers.js';

const router = Router();

router.post("/sign-up", signUpHandler);
router.post("/sign-in", signInHandler);
router.post("/logout", logoutHandler);
router.get("/me", meHandler);

export default router;
