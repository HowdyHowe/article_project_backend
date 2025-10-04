import prisma from "../prisma/client"

export const createArticleModel = async (article_id: string, title: string, content: string, user_id: string, category_id: string) => {
    return await prisma.article.create({ data: { article_id, title, content, user_id, category_id } });
};

export const getAllArticleModel = async (limit: number, page: number) => {
    const skip = (page - 1) * limit;
    return await prisma.article.findMany({ skip, take: limit, select: { article_id: true, title: true, content: true, created_at: true, updated_at: true, category: true, author: { select: { user_id: true, username: true, role: true } } } });
};

export const getSearchArticleModel = async (search: string, limit: number, page: number) => {
    const skip = (page - 1) * limit;
    return await prisma.article.findMany({ skip, take: limit, where: { title: { contains: search, mode: "insensitive" } }, select: { article_id: true, title: true, content: true, created_at: true, updated_at: true, category: true, author: { select: { user_id: true, username: true, role: true } } } });
};

export const getArticleModel = async (article_id: string) => {
    return await prisma.article.findUnique({ where: { article_id: article_id } });
};

export const updateArticleModel = async (article_id: string, title: string, content: string, user_id: string, category_id: string) => {
    return await prisma.article.update({ where: { article_id: article_id }, data: { title: title, content: content, user_id: user_id, category_id: category_id, updated_at: new Date() } })
}

export const deleteArticleModel = async (article_id: string) => {
    return await prisma.article.delete({ where: { article_id: article_id } });
};