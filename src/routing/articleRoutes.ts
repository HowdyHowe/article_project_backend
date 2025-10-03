import { Router } from "express";
import { createArticleController, deleteArticleController, searchArticleController, updateArticleController } from "../controllers/articleControllers";
import { authenticateToken } from "../middlewares/authTokenMiddleware";

const articleRouter = Router();

articleRouter.post("/addArticle", authenticateToken, createArticleController);
articleRouter.get("/searchArticle", authenticateToken, searchArticleController);
articleRouter.post("/updateArticle", authenticateToken, updateArticleController);
articleRouter.post("/deleteArticle", authenticateToken, deleteArticleController);

export default articleRouter;
