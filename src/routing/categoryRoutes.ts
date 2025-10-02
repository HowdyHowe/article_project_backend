import { Router } from "express";
import { authenticateToken } from "../middlewares/authTokenMiddleware";
import { createCategoryController } from "../controllers/categoryControllers";

const categoryRouter = Router();

categoryRouter.post("/addCategory", authenticateToken, createCategoryController)

export default categoryRouter;