import { Request, Response } from "express";
import pool from "../config/db";

export const userSignup = (req: Request, res: Response) => {
    try{
        const { username, password } = req.body;
        res.json({ message: "User Signed up", data: { username, password } })
    } catch (err) {
        console.error(err)
    }
};

export const userLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    res.json({ message: "User logged in", data: username })
}