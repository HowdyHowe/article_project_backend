import { Router } from "express";
import { authenticateToken } from "../middlewares/authTokenMiddleware";
import { userSignupController, userLoginController } from "../controllers/authControllers";

const authRouter = Router();

authRouter.post("/signup", userSignupController);
authRouter.post("/login", userLoginController);

export default authRouter;