import { Router } from "express";
import { userSignupController, userLoginController, userLogoutController } from "../controllers/authControllers";

const authRouter = Router();

authRouter.post("/signup", userSignupController);
authRouter.post("/login", userLoginController);
authRouter.get("/logout", userLogoutController);

export default authRouter;