import prisma from "../prisma/client";
import { Request, Response } from "express";
import * as userModel from "../models/authModel";

const generateUserId = async (): Promise<string> => {
  const count = await prisma.user.count();
  const next = count + 1;

  return `USR${String(next).padStart(4, "0")}`;
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const user = await userModel.getAll();
        res.status(200).json({message: "berhasil", data: {user}})
    } catch {
        res.status(409).json({message: "gagal"})
    }
}

export const userSignup = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user_id = await generateUserId();

        await userModel.createUser({user_id, username, password});

        res.status(201).json({message: "Successfully created"});
    } catch (err: any) {
        if (err.code === "P2002") {
            return res.status(409).json({message: "Username already exist"})
        }
        res.status(500).json({message: "Something went wrong", err})
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body
        const user = await userModel.getUser(username);

        if (!user) return res.status(401).json({message: "Invalid username or password"})
        if (user.password !== password) return res.status(401).json({message: "Invalid username or password"})

        res.status(200).json({message: "Successfully logged in"})
    } catch (err: any) {
        console.error(err)
    }
}