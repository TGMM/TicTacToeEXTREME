import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface UserPayload {
  id: string;
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token || "";

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET!, (err: unknown, payload: unknown) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }

    req.userId = (payload as UserPayload).id;
    next();
  });
}

export default verifyToken;
