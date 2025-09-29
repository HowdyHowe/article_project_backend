import * as userModel from "../models/authModel"
import { Request, Response } from "express";
import { sendResponse } from "../utils/response";
import prisma from "../prisma/client";

export const getAllArticles = async (req: Request, res: Response) => {
    try {
        const allArticles = await prisma.article.findMany();

        return sendResponse(res, 200, "Successfully get all article", { allArticles });
    } catch (err: any) {
        console.error(err);
    }
}