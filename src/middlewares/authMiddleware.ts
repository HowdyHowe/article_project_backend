import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import cookieParser from "../utils/cookieParser";

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

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = await req.headers["authorization"];
    const accessToken = authHeader?.split(" ")[1];
    const refreshToken = await cookieParser(req);
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessTokenSecret) return sendResponse(res, 500, "Server configuration error")
    if (!refreshTokenSecret) return sendResponse(res, 500, "Server configuration error")

    if (!accessToken || !refreshToken) return sendResponse(res, 401, "Access token required");

    try {
        const payloadRefresh = jwt.verify(refreshToken, refreshTokenSecret) as unknown as JwtPayload;
        const payloadAccess = jwt.verify(accessToken, accessTokenSecret) as unknown as JwtPayload;

        if (payloadAccess.user_id !== payloadRefresh.user_id) return sendResponse(res, 200, "test");

        req.user = payloadAccess;
        next();
    } catch (err: any) {
        console.error(err)
        return sendResponse(res, 403, "Invalid or expired token");
    }
};
