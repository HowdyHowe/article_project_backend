import { Router } from "express";
import { authenticateToken } from "../middlewares/authTokenMiddleware";
import { getAllArticleController } from "../controllers/articleControllers";
import { userSignupController, userLoginController, getAll } from "../controllers/authControllers";

const authRouter = Router();

authRouter.post("/signup", userSignupController);
authRouter.post("/login", userLoginController);
authRouter.get("/getall", authenticateToken, getAll);

// test

authRouter.get("/test", authenticateToken, getAllArticleController);

export default authRouter;