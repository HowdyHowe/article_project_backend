import prisma from "../prisma/client"

type CreateArticleType = {
    article_id  : string
    title       : string
    content     : string
    user_id     : string
    category_id : string
}

export const createArticleModel = async ({ article_id, title, content, user_id, category_id }: CreateArticleType) => {
    return await prisma.article.create({data: { article_id, title, content, user_id, category_id }})
}

export const getAllArticleModel = async () => {
    return await prisma.article.findMany();
}

export const getArticleModel = async (title: string) => {
    return await prisma.article.findMany({ where: { title: { contains: title, mode: "insensitive" } } });
}

export const deleteArticleModel = async (article_id: string) => {
    return await prisma.article.delete({ where: { article_id: article_id } })
}