import z from "zod";
import * as articleModel from "../models/articleModel";
import { Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { generateArticleId } from "../utils/generateID";

const createArticleSchema = z.object({
    title       : z.string().min(10, "Title minimum length must be 10 characters"),
    content     : z.string(),
    user_id     : z.string(),
    category_id : z.string()
});

const searchArticleSchema = z.object({
    search      : z.string()
});

const updateArticleSchema = createArticleSchema.extend({
    article_id  : z.string()
})

const deleteArticleSchema = z.object({
    input       : z.string()
})

export const createArticleController = async (req: Request, res: Response) => {
    try {
        const { title, content, user_id, category_id } = createArticleSchema.parse({
            title       : req.body.title,
            content     : req.body.content,
            user_id     : req.body.user_id,
            category_id : req.body.category_id
        });
        const article_id = await generateArticleId();
        const newArticle = await articleModel.createArticleModel(article_id, title, content, user_id, category_id);

        return sendResponse(res, 200, "Article successfully created", { article_id: newArticle.article_id, title: newArticle.title, user_id: newArticle.user_id, category_id: newArticle.category_id, created_at: newArticle.created_at })
    } catch (err: any) {
        console.error("Error in createArticleController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, messages.join(", "));
        }

        return sendResponse(res, 500, "Something went wrong");

    }
}

export const searchArticleController = async (req: Request, res: Response) => {
    try {
        const { search } = searchArticleSchema.parse({
            search      : req.body?.search ?? "",
        });

        const result = search === ""
            ? await articleModel.getAllArticleModel()
            : await articleModel.getSearchArticleModel(search)

        if (!result || result.length === 0) return sendResponse(res, 404, "Article not found");

        return sendResponse(res, 200, "Successfully found article", { result })
    } catch (err: any) {
        console.error("Error in getArticleController: ", err);

        if (err.name === "ZodError") return sendResponse(res, 400, "Invalid search parameter");

        return sendResponse(res, 500, "Failed to retrieve articles");
    }
};

export const updateArticleController = async (req: Request, res: Response) => {
    try {
        const { article_id, title, content, user_id, category_id } = updateArticleSchema.parse({
            article_id  : req.body.article_id,
            title       : req.body.title,
            content     : req.body.content,
            user_id     : req.body.user_id,
            category_id : req.body.category_id
        });
        const articleExistance = await articleModel.getArticleModel(article_id);
        const updateArticle = await articleModel.updateArticleModel(article_id, title,  content, user_id, category_id);

        if (!articleExistance) return sendResponse(res, 404, "Article not found");
        if (user_id !== updateArticle.user_id) return sendResponse(res, 403, "Admin didnt own this article");

        return sendResponse(res, 200, "Successfully updated", { article_id: updateArticle.article_id, title: updateArticle.title, user_id: updateArticle.user_id, category_id: updateArticle.category_id, created_at: updateArticle.created_at });
    } catch (err: any) {
        console.error("Error in updateArticleController: ", err)

    if (err instanceof z.ZodError) {
        const messages = err.issues.map((e) => e.message);
        return sendResponse(res, 400, messages.join(", "));
    }
        if (err.code === "P2002") return sendResponse(res, 409, "Article title already exists");

        return sendResponse(res, 500, "Failed to update article");
    }
};

export const deleteArticleController = async (req: Request, res: Response) => {
    try{
        const { input } = deleteArticleSchema.parse({
            input       : req.body.delete ?? "",
        })

        if (!input) return sendResponse(res, 400, "Invalid article ID")

        const result = await articleModel.deleteArticleModel(input);

        return sendResponse(res, 200, "Article deleted successfully", { result });
    } catch (err: any) {
        console.error("Error in deleteArticleController: ", err);

        if (err.code === "P2025") return sendResponse(res, 404, "Article not found");

        return sendResponse(res, 500, "Failed to delete Article");
    }
};
