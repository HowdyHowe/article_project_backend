import { Response } from "express";

export const sendResponse = (res: Response, status: number, message: string, data?: any ) => {
    res.status(status).json({statusCode: status, message: message, data: data})
}