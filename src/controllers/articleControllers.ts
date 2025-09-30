import z from "zod";
import * as articleModel from "../models/articleModel";
import { Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { generateArticleId } from "../utils/generateID";

const searchSchema = z.object({
    search      : z.string()
});

const articleSchema = z.object({
    title       : z.string().min(10, "Title minimum length must be 10 characters"),
    content     : z.string(),
    user_id     : z.string(),
    category_id : z.string()
});

export const createArticleController = async (req: Request, res: Response) => {
    try {
        const { title, content, user_id, category_id } = articleSchema.parse({
            title       : req.body.title,
            content     : req.body.content,
            user_id     : req.body.user_id,
            category_id : req.body.category_id
        });
        const article_id = await generateArticleId();
        const newArticle = await articleModel.createArticleModel({ article_id: article_id, title: title, content: content, user_id: user_id, category_id: category_id });

        return sendResponse(res, 200, "Successfully created", { article_id: newArticle.article_id, title: newArticle.title, user_id: newArticle.user_id, category_id: newArticle.category_id, created_at: newArticle.created_at })
    } catch (err: any) {
        console.error("Error in createArticleController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, messages.join(", "));
        }
        if (err.code === "P2002") return sendResponse(res, 409, "Article title already exist");

        return sendResponse(res, 500, "Something went wrong");

    }
}

export const getAllArticleController = async (req: Request, res: Response) => {
    try {
        const allArticles = await articleModel.getAllArticleModel();

        return sendResponse(res, 200, "Successfully get all article", { allArticles });
    } catch (err: any) {
        console.error("Error in getAllArticleController: ", err);

        if (err.code === "P2021") return sendResponse(res, 500, "Table not found");

        return sendResponse(res, 500, "Failed to fetch articles");
    }
};

export const getArticleController = async (req: Request, res: Response) => {
    try {
        const { search } = searchSchema.parse({
            search: req.body.search ?? "",
        });

        const result = search === ""
            ? await articleModel.getAllArticleModel()
            : await articleModel.getArticleModel(search)

        return sendResponse(res, 200, "Successfully found article", { result })
    } catch (err: any) {
        console.error("Error in getArticleController: ", err)

        if (err.name === "ZodError") return sendResponse(res, 200, "Invalid search parameter");

        return sendResponse(res, 500, "Failed to retrieve articles")
    }
};
