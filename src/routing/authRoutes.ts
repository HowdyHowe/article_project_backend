import { Router } from "express";
import { userSignup, userLogin, getAll } from "../controllers/authControllers";
import { authenticateToken } from "../middlewares/authMiddleware";
import { getAllArticle } from "../controllers/articleControllers";

const authRouter = Router();

authRouter.post("/signup", userSignup);
authRouter.post("/login", userLogin);
authRouter.get("/getall", authenticateToken, getAll);

// test

authRouter.get("/test", getAllArticle);

export default authRouter;