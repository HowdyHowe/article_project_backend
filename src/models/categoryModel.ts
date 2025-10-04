import prisma from "../prisma/client"

export const createCategoryModel = async (category_id: string, name: string) => {
    return await prisma.category.create({ data: { category_id, name } });
};

export const getAllCategoryModel = async (limit: number, page: number) => {
    const skip = (page - 1) * limit;
    return await prisma.category.findMany({ skip, take: limit });
};

export const getSearchCategoryModel = async (search: string, limit: number, page: number) => {
    const skip = (page - 1) * limit
    return await prisma.category.findMany({skip, take: limit, where: { name: { contains: search, mode: "insensitive" } } });
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
