import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";

interface JwtPayload {
    user_id: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) return sendResponse(res, 401, "Access token required");

    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    if (!accessTokenSecret) return sendResponse(res, 500, "Server configuration error")

    try {
        const payload = jwt.verify(token, accessTokenSecret) as unknown as JwtPayload

        req.user = payload;
        next();
    } catch (err: any) {
        console.error(err)
        return sendResponse(res, 403, "Invalid or expired token");
    }
};
