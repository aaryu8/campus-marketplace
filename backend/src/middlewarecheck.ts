
import type { NextFunction, Request, Response } from "express";
import { getUserfromSession } from "./actions/session.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const userInfo = await getUserfromSession(req);
    if (!userInfo) {
        return res.status(401).send({ msg: "YOU ARE NOT LOGGED IN" });
    }
    console.log(userInfo);
    res.locals.user = userInfo;
    next();
}