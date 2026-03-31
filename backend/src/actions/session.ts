import crypto from 'crypto'
import { redisClient } from '../redis/redis.js'
import type { Request, Response } from 'express';
import z from 'zod';


const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;



const sessionSchema = z.object({
  id: z.string(),
  name : z.string(),
  email : z.string()
})

type UserSession = z.infer<typeof sessionSchema>



export async function createSession( user : UserSession , res : Response){
    const sessionId = crypto.randomBytes(512).toString("hex").normalize();

    // Stringify before storing:
    await redisClient.set(`session:${sessionId}`, JSON.stringify(sessionSchema.parse(user)), {
      ex: SESSION_EXPIRATION_SECONDS,
    });

    res.cookie("session_id", `${sessionId}`, {
      httpOnly: true,
      secure: true,        // hardcode true, don't rely on env
      sameSite: 'none',    // hardcode none for cross-domain
      maxAge: SESSION_EXPIRATION_SECONDS * 1000,
      path: '/',
      domain: undefined,   // don't set domain for cross-origin
    });
}

//this function auto checks if cookie and redis client both match or not 
export async function getUserfromSession(req: Request) {
  const sessionId = req.cookies.session_id;
  if (!sessionId) return null;

  const rawUser = await redisClient.get(`session:${sessionId}`);
  if (!rawUser) return null;

  const parsed = typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;
  const { success, data: user } = sessionSchema.safeParse(parsed);
  return success ? user : null;
}


export async function removeUserfromSession(req: Request , res:Response){
  const sessionId = req.cookies.session_id;
  if(sessionId == null ) return null;

  await redisClient.del(`session:${sessionId}`);
  res.clearCookie('session_id', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
  return true;
}





