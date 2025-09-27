import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({quiet: true});

export const generateToken = async (user_id: string, username: string) => {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
        throw new Error("JWT secrets are not defined in environment variables.");
    }

    const accessToken = jwt.sign(
        { user_id: user_id, username: username },
        accessSecret,
        { expiresIn: "30m" }
    );

    const refreshToken = jwt.sign(
        { user_id: user_id, username: username },
        refreshSecret,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
}
