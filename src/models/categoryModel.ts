import prisma from "../prisma/client"

type CreateArticleType = {
    category_id : string
    name        : string
};

export const createCategoryModel = async ({ category_id, name }: CreateArticleType) => {
    return await prisma.category.create({ data: {category_id, name,} });
};

export const getAllCategoryModel = async () => {
    return await prisma.category.findMany();
};

export const getCategoryModel = async (category_id: string) => {
    return await prisma.category.findUnique({ where: {category_id: category_id} });
};

export const deleteCategoryModel = async (category_id: string) => {
    return await prisma.category.delete({ where: {category_id: category_id} });
};
