import { Router } from "express";
import { createArticleController, getAllArticleController } from "../controllers/articleControllers";
import { authenticateToken } from "../middlewares/authTokenMiddleware";

const articleRouter = Router();

articleRouter.post("/add", authenticateToken, createArticleController);
articleRouter.get("/getAll", authenticateToken, getAllArticleController);

export default articleRouter;