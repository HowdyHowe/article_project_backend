import prisma from "../prisma/client"

export const getAllArticlesModel = async () => {
    return await prisma.article.findMany();
}

export const getArticleModel = async (input: string) => {
    return await prisma.article.findMany({ where: { title: { contains: input, mode: "insensitive" } } });
}