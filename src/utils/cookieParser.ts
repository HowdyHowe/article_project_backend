import { Request } from "express";

export default function cookieParser (req: Request) {
    const rawCookies = req.headers.cookie;
    let refreshToken: string | undefined;

    if (rawCookies) {
    const cookies = Object.fromEntries(
        rawCookies.split("; ").map(c => {
        const [key, value] = c.split("=");
        return [key, value];
        })
    );
    refreshToken = cookies.refreshToken;
    }

    return refreshToken;
}