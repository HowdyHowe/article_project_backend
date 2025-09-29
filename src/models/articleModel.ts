import prisma from "../prisma/client"

export const getArticles = async () => {
    return await prisma.article.findMany();
}