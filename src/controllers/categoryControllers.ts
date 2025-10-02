import { Request, Response } from "express";
import z from "zod";
import * as categoryModel from "../models/categoryModel";
import { generateCategoryId } from "../utils/generateID";
import { sendResponse } from "../utils/response";

const createCategorySchema = z.object({
    name        : z.string().min(4, "Category name minimum lenght is 4 characters")
});

const getCategorySchema = z.object({
    category_id  : z.string()
});

const searchCategorySchema = z.object({
    search      : z.string()
});

export const createCategoryController = async (req: Request, res: Response) => {
    try {
        const { name } = createCategorySchema.parse({
            name    : req.body.name
        });
        const category_id = await generateCategoryId();
        const newCategory = await categoryModel.createCategoryModel(category_id, name);

        return sendResponse(res, 200, "Category successfully created", { newCategory });
    } catch (err: any) {
        console.error("Error in addCategoryController: ", err);
        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, messages.join(", "));
        }

        if (err.code === "P2003") return sendResponse(res, 400, "Invalid reference (foreign key constraint failed)");

        if (err.code === "P2002") return sendResponse(res, 409, "Category already exists");

        return sendResponse(res, 500, "Something went wrong");
    }
};

export const getCategoryController = async (req: Request, res: Response) => {
    try {
        const { category_id } = getCategorySchema.parse({
            category_id : req.body.category_id
        })
        const getCategory = await categoryModel.getCategoryModel(category_id);

        if (!getCategory) return sendResponse(res, 404, "Category not found");

        return sendResponse(res, 200, "Successfully found category", { getCategory })
    } catch (err: any) {
        console.error(err);

        if (err.name === "ZodError") return sendResponse(res, 400, "Invalid input");

        if (err.code === "P2025") return sendResponse(res, 404, "Category not found");

        return sendResponse(res, 500, "Something went wrong");
    }
};

export const searchCategoryController = async (req: Request, res: Response) => {
    try {
        const { search } = searchCategorySchema.parse({
            search  : req.body?.search ?? ""
        });
        const result = search === ""
            ? await categoryModel.getAllCategoryModel()
            : await categoryModel.getSearchCategoryModel(search)

        if (!result || result.length === 0) return sendResponse(res, 404, "Category not found");

        return sendResponse(res, 200, "Successfully found category", { result });
    } catch (err: any) {
        console.error("Error in readCategoryController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, messages.join(", "));
        }

        if (err.name === "ZodError") return sendResponse(res, 400, "Invalid search parameter");

        if (err.code === "P2025") return sendResponse(res, 404, "Category not found");

        return sendResponse(res, 500, "Failed to retrieve categories");
    }
};

export const updateCategoryController = (req: Request, res: Response) => {
    try {

    } catch (err: any) {

    }
};

export const deleteCategoryController = () => {
    try {

    } catch (err: any) {

    }
};
