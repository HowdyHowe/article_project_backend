import { Role } from "@prisma/client";
import prisma from "../prisma/client";

type CreateUserType = {
    user_id : string
    username: string
    password: string
    role    : Role
}

export const createUserModel = async ({ user_id, username, password, role }: CreateUserType) => {
    return await prisma.user.create({data: { user_id, username, password, role }})
};

export const getUserModel = async (username: string) => {
    return await prisma.user.findUnique({where: {username: username}})
}

export const getAll = async () => {
    return await prisma.user.findMany();
}