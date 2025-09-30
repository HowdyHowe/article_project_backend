import z from "zod";
import bcrypt from "bcrypt";
import * as authModel from "../models/authModel";
import { Role } from "@prisma/client";
import { Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { generateUserId } from "../utils/generateID";
import { generateToken } from "../utils/generateToken";

const authSchema = z.object({
    username: z.string().min(8, "Username minimum length must be 8 characters"),
    password: z.string().min(8, "Password minimum length must be 8 characters"),
    role    : z.enum([ "USER", "ADMIN" ])
});

export const getAll = async (req: Request, res: Response) => {
    try {
        const user = await authModel.getAll();
        sendResponse(res, 201, "Success", { user })
    } catch {
        sendResponse(res, 409, "Failed")
    }
}

export const userSignupController = async (req: Request, res: Response) => {
    try {
        const { username, password, role } = authSchema.parse({
            username: req.body.username?.trim(),
            password: req.body.password?.trim(),
            role    : req.body.role?.toUpperCase()
        });
        const user_id = await generateUserId();
        const hashedPassword = await bcrypt.hash(password, 10);
        const roleEnum = role === "ADMIN"
            ? Role.ADMIN
            : Role.USER;
        const newUser = await authModel.createUserModel({ user_id: user_id, username: username, password: hashedPassword, role: roleEnum });

        return sendResponse(res, 201, "Successfully Created", { user_id: newUser.user_id, username: newUser.username, role: roleEnum });
    } catch (err: any) {
        console.error("Error in userSignupController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, messages.join(", "));
        }
        if (err.code === "P2002") return sendResponse(res, 409, "Username already exist");

        return sendResponse(res, 500, "Something went wrong");
    }
};

export const userLoginController = async (req: Request, res: Response) => {
    try {
        const { username, password } = authSchema.parse({
            username: req.body.username?.trim(),
            password: req.body.password?.trim()
        })
        const user = await authModel.getUserModel(username);
        if (!user) return sendResponse(res, 401, "Invalid username or password");

        const isPasswordValid = await bcrypt.compare(password, user.password || "");
        if (!isPasswordValid) return sendResponse(res, 401, "Invalid username or password");

        const { accessToken, refreshToken } = await generateToken(user.user_id, user.username);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // change secure when production
            secure  : false,
            sameSite: "strict",
            maxAge  : 7 * 24 * 60 * 60 * 1000
        })

        return sendResponse(res, 200, "Successfully logged in", { user_id: user.user_id, username: user.username, token: accessToken });
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, messages.join(", "));
        }

        console.error("Error in userLoginController: ", err);
        return sendResponse(res, 500, "Something went wrong");
    }
}