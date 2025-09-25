import prisma from "../prisma/client";

type CreateUserType = {
    user_id: string
    username: string
    password: string
}

export const createUser = async ({ user_id, username, password }: CreateUserType) => {
    return await prisma.user.create({data: { user_id, username, password }})
};

export const getUser = async (username: string) => {
    return await prisma.user.findUnique({where: {username: username}})
}

export const getAll = async () => {
    return await prisma.user.findMany();
}