import { Request, Response } from "express";
import { z, ZodType } from "zod";
import * as categoryModel from "../models/categoryModel";
import { generateCategoryId } from "../utils/generateID";
import { sendResponse } from "../utils/response";

const createCategorySchema = z.object({
    name        : z.string().nonempty("Category name is required").min(3, "Category name minimum length is 3 characters")
});

const getCategorySchema = z.object({
    category_id : z.string().nonempty("Category name is required")
});

const searchCategorySchema = z.object({
    search      : z.string()
});

const updateCategorySchema = z.object({
    category_id : z.string(),
    new_name    : z.string().min(3, "Category name minimum length is 3 characters")
});

const deleteCategorySchema = z.object({
    category_id : z.string(),
});

export const createCategoryController = async (req: Request, res: Response) => {
    try {
        const { name } = createCategorySchema.parse(req.body);
        const category_id = await generateCategoryId();
        const newCategory = await categoryModel.createCategoryModel(category_id, name);

        return sendResponse(res, 200, "Category successfully created", { newCategory });
    } catch (err: any) {
        console.error("Error in addCategoryController: ", err);
        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        };

        if (err.code === "P2003") return sendResponse(res, 400, "Invalid reference", { error: "foreign key constraint failed" });

        if (err.code === "P2002") return sendResponse(res, 409, "Duplicate category", {error: "Category already exists"});

        return sendResponse(res, 500, "Failed to create categories", { error: "An unexpected server error occurred while creating category" });
    }
};

export const getCategoryController = async (req: Request, res: Response) => {
    try {
        const { category_id } = getCategorySchema.parse({
            category_id : req.body.category_id
        });
        const getCategory = await categoryModel.getCategoryModel(category_id);

        if (!getCategory) return sendResponse(res, 404, "Category not found", { error: "No category exists with the given ID" });

        return sendResponse(res, 200, "Successfully get category", { category_id: getCategory.category_id, name: getCategory.name, created_at: getCategory.created_at, updated_at: getCategory.updated_at });
    } catch (err: any) {
        console.error("Error in getCategoryController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        };

        if (err.code === "P2025") return sendResponse(res, 404, "Category not found", { error: "No category exists with the given ID" });

        return sendResponse(res, 500, "Failed to retrieve category", { error: "An unexpected server error occurred while creating category" });
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

        if (!result || result.length === 0) return sendResponse(res, 404, "Category not found", { error: "No category exists with the given ID" });

        return sendResponse(res, 200, "Successfully found category", { result });
    } catch (err: any) {
        console.error("Error in readCategoryController: ", err);

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        }

        if (err.code === "P2025") return sendResponse(res, 404, "Category not found", { error: "No category exists with the given ID" });

        return sendResponse(res, 500, "Failed to retrieve categories", { error: "An unexpected server error occurred while searching category" });
    }
};

export const updateCategoryController = async (req: Request, res: Response) => {
    try {
        const { category_id, new_name } = updateCategorySchema.parse({
            category_id     : req.body.category_id,
            new_name        : req.body.new_name
        });
        const categoryExistance = await categoryModel.getCategoryModel(category_id);
        // if (!categoryExistance) return sendResponse(res, 404, "Category did not exist");

        const updateCategory = await categoryModel.updateCategoryModel(category_id, new_name);

        return sendResponse(res, 200, "Successfully updated", { name: updateCategory.name });
    } catch (err: any) {
        console.error("Error in updateCategoryController: ", err)

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        }
        if (err.code === "P2002") return sendResponse(res, 409, "Duplicate category", {error: "Category already exists"});

        return sendResponse(res, 500, "Failed to update category", { error: "An unexpected server error occurred while updating category" });
    }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
    try {
        const { category_id } = deleteCategorySchema.parse({
            category_id : req.body.category_id
        });
        const deleteCategory = await categoryModel.deleteCategoryModel(category_id);

        return sendResponse(res, 200, "Successfully deleted", { name: deleteCategory.name });
    } catch (err: any) {
        console.error("Error in deleteCategoryController: ", err)

        if (err instanceof z.ZodError) {
            const messages = err.issues.map((e) => e.message);
            return sendResponse(res, 400, "Validation failed", { error: messages });
        } ;

        if (err.code === "P2025") return sendResponse(res, 404, "Category not found", { error: "No category exists with the given ID" });

        return sendResponse(res, 500, "Failed to delete category", { error: "An unexpected server error occurred while deleting category" });
    }
};
