import prisma from "../prisma/client"

export const createCategoryModel = async (category_id: string, name: string) => {
    return await prisma.category.create({ data: { category_id, name } });
};

export const getAllCategoryModel = async () => {
    return await prisma.category.findMany();
};

export const getSearchCategoryModel = async (input: string) => {
    return await prisma.category.findMany({ where: { name: { contains: input, mode: "insensitive" } } });
};

export const getCategoryModel = async (category_id: string) => {
    return await prisma.category.findUnique({ where: { category_id: category_id } });
};

export const updateCategoryModel = async (category_id: string, name: string) => {
    return await prisma.category.update({ where: {category_id: category_id}, data: { name: name, updated_at: new Date() } })
}

export const deleteCategoryModel = async (category_id: string) => {
    return await prisma.category.delete({ where: { category_id: category_id } });
};
