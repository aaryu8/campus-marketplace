import type { Request, Response } from "express";
import crypto from "crypto";
import { hashPassword, comparePasswords } from "../actions/passwordRelated.js";
import { prisma } from "../db.js";
import { signinformInput, signupformInput } from "../schema.js";
import { createSession, getUserfromSession, removeUserfromSession } from "./session.js";


export async function signUpHandler(req: Request, res: Response) {
    try {
        const rawData = req.body;
        const { success, data } = signupformInput.safeParse(rawData);

        if (!success) {
            return res.status(400).send({
                authStatus: false,
                msg: "Invalid input data"
            });
        }

        const { name, email, password } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).send({
                authStatus: false,
                msg: "User already exists, please sign in"
            });
        }

        const salt = crypto.randomBytes(16).toString("hex");
        const hashedPassword = await hashPassword(password, salt);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword, salt }
        });

        const sessionObject = { id: user.id, name: user.name, email: user.email };
        await createSession(sessionObject, res);

        return res.status(201).send({ authStatus: true, msg: "User created successfully" });

    } catch (error) {
        console.error("Error in sign-up:", error);
        return res.status(500).send({ authStatus: false, msg: "Internal server error" });
    }
}


export async function signInHandler(req: Request, res: Response) {
    try {
        const { success, data } = signinformInput.safeParse(req.body);

        if (!success) {
            return res.status(400).send({ authStatus: false, msg: "Invalid input data" });
        }

        const { email, password } = data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).send({ authStatus: false, msg: "User not found. Please sign up first" });
        }

        const isPasswordValid = await comparePasswords(password, user.salt, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ authStatus: false, msg: "Incorrect password" });
        }

        const sessionObject = { id: user.id, name: user.name, email: user.email };
        await createSession(sessionObject, res);

        return res.status(200).send({ authStatus: true, msg: "Login successful" });

    } catch (error) {
        console.error("Error in sign-in:", error);
        return res.status(500).send({ authStatus: false, msg: "Internal server error" });
    }
}


export async function logoutHandler(req: Request, res: Response) {
    const response = await removeUserfromSession(req, res);
    if (!response) {
        return res.status(500).send({ msg: "Internal Server Error" });
    }
    return res.status(200).send({ msg: "Logged out successfully" });
}


export async function meHandler(req: Request, res: Response) {
    try {
        const user = await getUserfromSession(req);
        if (!user) {
            return res.status(401).send({ LoggedIn: false, user: null });
        }
        return res.status(200).send({ LoggedIn: true, user });
    } catch (error) {
        console.error("Error in /me:", error);
        return res.status(500).send({ msg: "Internal server error" });
    }
}
