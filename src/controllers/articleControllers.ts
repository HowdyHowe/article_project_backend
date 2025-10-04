import z from "zod";
import * as articleModel from "../models/articleModel";
import { Request, Response } from "express";
import { sendResponse } from "../utils/response";
import { generateArticleId } from "../utils/generateID";

const createArticleSchema = z.object({
    title       : z.string().min(10, "Title minimum length must be 10 characters"),
    content     : z.string(),
    category_id : z.string()
});

const getArticleSchema = z.object({
    article_id: z.string()
})

const searchArticleSchema = z.object({
    search      : z.string()
});

const updateArticleSchema = createArticleSchema.extend({
    article_id  : z.string()
});

const deleteArticleSchema = z.object({
    article_id       : z.string()
});

export const createArticleController = async (req: Request, res: Response) => {
    try {
        const { title, content, category_id } = createArticleSchema.parse(req.body);
        const user_id = req.user?.user_id;

        if (!user_id) return sendResponse(res, 400, "Validation error", { error: "User ID is required" });

        const article_id = await generateArticleId();
        const newArticle = await articleModel.createArticleModel(article_id, title, content, user_id, category_id);

        return sendResponse(res, 200, "Article successfully created", { result: { article_id: newArticle.article_id, title: newArticle.title, user_id: newArticle.user_id, category_id: newArticle.category_id, created_at: newArticle.created_at, updated_at: newArticle.updated_at } })
    } catch (err: any) {
        console.error("Error in createArticleController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        }

        if (err.code === "P2003") return sendResponse(res, 400, "Invalid reference", { error: "foreign key constraint failed" });

        if (err.code === "P2002") return sendResponse(res, 409, "Duplicate article", {error: "Article already exists"});

        return sendResponse(res, 500, "Failed to create article", { error: "An unexpected server error occurred while creating article" });
    }
};

export const getArticleController = async (req: Request, res: Response) => {
    try {
        const { article_id } = getArticleSchema.parse(req.body);
        const result = await articleModel.getArticleModel(article_id);

        if (!result) return sendResponse(res, 404, "Validation error", { error: "Article not found" });

        return sendResponse(res, 200, "Successfully get article", { result })
    } catch (err: any) {
        console.error("Error in getArticleController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        };

        if (err.code === "P2025") return sendResponse(res, 404, "Article not found", { error: "No article exists with the given ID" });

        return sendResponse(res, 500, "Failed to retrieve article", { error: "An unexpected server error occurred while retrieving article" });
    }
};

export const searchArticleController = async (req: Request, res: Response) => {
    try {
        const { search } = searchArticleSchema.parse({
            search      : req.body?.search ?? "",
        });

        const result = search === ""
            ? await articleModel.getAllArticleModel()
            : await articleModel.getSearchArticleModel(search)

        if (!result || result.length === 0) return sendResponse(res, 404, "Article not found", { error: "No article exists with the given keyword" });

        return sendResponse(res, 200, "Successfully found article", { result })
    } catch (err: any) {
        console.error("Error in searchArticleController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        }

        if (err.code === "P2025") return sendResponse(res, 404, "Article not found", { error: "No article exists with the given keyword" });

        return sendResponse(res, 500, "Failed to retrieve article", { error: "An unexpected server error occurred while searching article" });
    }
};

export const updateArticleController = async (req: Request, res: Response) => {
    try {
        const { article_id, title, content, category_id } = updateArticleSchema.parse(req.body);

        const user_id = req.user?.user_id;
        if (!user_id) return sendResponse(res, 400, "Validation error", { error: "User ID is required" });

        const articleExistance = await articleModel.getArticleModel(article_id);
        if (!articleExistance) return sendResponse(res, 404, "Validation error", { error: "Article did not exist" });

        const updateArticle = await articleModel.updateArticleModel(article_id, title,  content, user_id, category_id);
        if (user_id !== updateArticle.user_id) return sendResponse(res, 403, "Admin didnt own this article");

        return sendResponse(res, 200, "Successfully updated", { article_id: updateArticle.article_id, title: updateArticle.title, user_id: updateArticle.user_id, category_id: updateArticle.category_id, created_at: updateArticle.created_at });
    } catch (err: any) {
        console.error("Error in updateArticleController: ", err)

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        }
        if (err.code === "P2002") return sendResponse(res, 409, "Duplicate article", { error: "Article title already exists" });

        return sendResponse(res, 500, "Failed to update article", { error: "An unexpected server error occured while updating article" });
    }
};

export const deleteArticleController = async (req: Request, res: Response) => {
    try{
        const { article_id } = deleteArticleSchema.parse(req.body);
        const result = await articleModel.deleteArticleModel(article_id);

        return sendResponse(res, 200, "Article deleted successfully", { result });
    } catch (err: any) {
        console.error("Error in deleteArticleController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        } ;

        if (err.code === "P2025") return sendResponse(res, 404, "Article not found", { error: "No article exists with the given ID" });

        return sendResponse(res, 500, "Failed to delete article", { error: "An unexpected server error occurred while deleting article" });
    }
};
