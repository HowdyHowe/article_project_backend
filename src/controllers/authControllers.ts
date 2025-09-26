import z from "zod";
import { Request, Response } from "express";
import prisma from "../prisma/client";
import * as userModel from "../models/authModel";
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
        const { username, password } = authSchema.parse(req.body)
        const user_id = await generateUserId();
        const newUser = await userModel.createUser({user_id, username, password});

        return res.status(201).json({message: "Successfully created", statusCode: 201, data: {user_id: newUser.user_id, username: newUser.username}});
    } catch (err: any) {
        if (err.code === "P2002") return res.status(409).json({message: "Username already exist", statusCode: 409})
        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return res.status(400).json({message: messages, statusCode: 400})
        }

        res.status(500).json({message: "Something went wrong", statusCode: 500})
        console.error(err)
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const user = await userModel.getUser(username);

        if (!user) return res.status(401).json({message: "Invalid username or password"})
        if (user.password !== password) return res.status(401).json({message: "Invalid username or password", statusCode: 401})

        res.status(200).json({message: "Successfully logged in", statusCode: 200})
    } catch (err: any) {
        console.error(err)
    }
}