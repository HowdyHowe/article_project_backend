import { Request, Response } from "express";
import z from "zod";

const categorySchema = z.object({
    name : z.string().min(4, "Category name minimum lenght is 4 characters")
});

export const addCategoryController = (req: Request, res: Response) => {
    try {

    } catch (err: any) {

    }
};

export const searchCategoryController = (req: Request, res: Response) => {
    try {

    } catch (err: any) {

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
