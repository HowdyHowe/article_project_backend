import { Router } from "express";
import { createArticleController, deleteArticleController, searchArticleController } from "../controllers/articleControllers";
import { authenticateToken } from "../middlewares/authTokenMiddleware";

const articleRouter = Router();

articleRouter.post("/addArticle", authenticateToken, createArticleController);
articleRouter.get("/searchArticle", authenticateToken, searchArticleController);
articleRouter.post("/deleteArticle", authenticateToken, deleteArticleController);

export default articleRouter;