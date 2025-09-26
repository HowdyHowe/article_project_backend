import z from "zod";
import bcrypt from "bcrypt";
import * as userModel from "../models/authModel";
import { Request, Response } from "express";
import { generateUserId } from "../utils/generateID";
import { sendResponse } from "../utils/response";

const authSchema = z.object({
    username: z.string().min(8, "Username minimum length must be 8 characters"),
    password: z.string().min(8, "Password minimum length must be 8 characters")
});

export const getAll = async (req: Request, res: Response) => {
    try {
        const user = await userModel.getAll();

        sendResponse(res, 201, "Success", { user })
    } catch {

        sendResponse(res, 409, "Failed")
    }
}

export const userSignup = async (req: Request, res: Response) => {
    try {
        const { username, password } = authSchema.parse({
            username: req.body.username?.trim(),
            password: req.body.password?.trim()
        })
        const user_id = await generateUserId();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.createUser({user_id: user_id, username: username, password: hashedPassword});

        return sendResponse(res, 201, "Successfully Created", { user_id: newUser.user_id, username: newUser.username  });
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, messages.join(", "));
        }
        if (err.code === "P2002") return sendResponse(res, 409, "Username already exist");

        console.error(err);
        return sendResponse(res, 500, "Something went wrong");
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = authSchema.parse({
            username: req.body.username?.trim(),
            password: req.body.password?.trim()
        })
        const user = await userModel.getUser(username);
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!user) return sendResponse(res, 401, "Invalid username or password");
        if (user.password !== hashedPassword) return sendResponse(res, 401, "Invalid username or password");

        return sendResponse(res, 200, "Successfully logged in", { user_id: user.user_id, username: user.username });
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, messages.join(", "));
        }

        console.error(err);
        return sendResponse(res, 500, "Something went wrong");
    }
}