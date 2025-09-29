import z from "zod";
import * as articleModel from "../models/articleModel";
import { Request, Response } from "express";
import { sendResponse } from "../utils/response";

const searchArticleSchema = z.object({
    search: z.string()
});

export const getAllArticleController = async (req: Request, res: Response) => {
    try {
        const allArticles = await articleModel.getAllArticlesModel();

        return sendResponse(res, 200, "Successfully get all article", { allArticles });
    } catch (err: any) {
        console.error("Error in getAllArticleController: ", err);

        if (err.code === "P2021") return sendResponse(res, 500, "Table not found");

        return sendResponse(res, 500, "Failed to fetch articles");
    }
};

export const getArticleController = async (req: Request, res: Response) => {
    try {
        const { search } = searchArticleSchema.parse({
            search: req.body.search ?? "",
        });

        const result = search === ""
            ? await articleModel.getAllArticlesModel()
            : await articleModel.getArticleModel(search)

        return sendResponse(res, 200, "Successfully found article", { result })
    } catch (err: any) {
        console.error("Error in getArticleController: ", err)

        if (err.name === "ZodError") return sendResponse(res, 200, "Invalid search parameter");

        return sendResponse(res, 500, "Failed to retrieve articles")
    }
};
