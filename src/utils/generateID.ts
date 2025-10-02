import prisma from "../prisma/client";

export const generateUserId = async (): Promise<string> => {
  const count = await prisma.user.count();
  const next  = count + 1;

  return `USR${String(next).padStart(4, "0")}`;
};

export const generateArticleId = async (): Promise<string> => {
  const count = await prisma.article.count();
  const next  = count + 1;

  return `ART${String(next).padStart(4, "0")}`;
};

export const generateCategoryId = async (): Promise<string> => {
  const count = await prisma.category.count();
  const next  = count + 1;

  return `CTG${String(next).padStart(4, "0")}`;
}