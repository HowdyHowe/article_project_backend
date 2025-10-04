import { Router } from "express";
import { userSignupController, userLoginController } from "../controllers/authControllers";

const authRouter = Router();

authRouter.post("/signup", userSignupController);
authRouter.post("/login", userLoginController);

export default authRouter;