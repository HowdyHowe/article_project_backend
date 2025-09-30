import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";
import cookieParser from "../utils/cookieParser";
import { generateToken } from "../utils/generateToken";

interface PayloadData extends JwtPayload {
    user_id: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: PayloadData;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader            = req.headers["authorization"];
    const curAccessToken        = authHeader?.split(" ")[1];
    const curRefreshToken       = await cookieParser(req);
    const accessTokenSecret     = process.env.JWT_ACCESS_SECRET;
    const refreshTokenSecret    = process.env.JWT_REFRESH_SECRET;
    let payloadAccess   : PayloadData;
    let payloadRefresh  : PayloadData;

    if (!accessTokenSecret || !refreshTokenSecret) return sendResponse(res, 500, "Server configuration error")
    if (!curAccessToken || !curRefreshToken) return sendResponse(res, 401, "Access token required");

    // verifying refresh token
    try {
        payloadRefresh = jwt.verify(curRefreshToken, refreshTokenSecret) as unknown as PayloadData;
    } catch (err: any) {
        if (err instanceof TokenExpiredError) {
            res.cookie("refreshToken", "", {
                httpOnly: true,
                // change true when on production
                secure  : false,
                sameSite: "strict",
                maxAge  : 0
            });

            return sendResponse(res, 401, "Refresh token expired")
        }

        console.error(err);
        return sendResponse(res, 401, "Invalid refesh token");
    }

    // verifying access token
    try {
        payloadAccess = jwt.verify(curAccessToken, accessTokenSecret) as unknown as PayloadData;
        if (payloadAccess.user_id !== payloadRefresh.user_id) return sendResponse(res, 403, "Token mismatch detected");

        req.user = payloadAccess;
        return next();
    } catch (err: any) {
        if (err instanceof TokenExpiredError) {
            // creating new access token
            try {
                const { accessToken } = await generateToken(payloadRefresh.user_id, payloadRefresh.username);

                return sendResponse(res, 200, "Access token refreshed", { newAccessToken: accessToken });
            } catch (err: any) {
                console.error("error: ", err.message);
                return sendResponse(res, 500, "Failed to generate new access token")
            }
        }

        console.error(err);
        return sendResponse(res, 401, "Invalid access token");
    }
};
