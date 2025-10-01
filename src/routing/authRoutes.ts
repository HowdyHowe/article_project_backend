import { Router } from "express";
import { authenticateToken } from "../middlewares/authTokenMiddleware";
import { userSignupController, userLoginController, getAll } from "../controllers/authControllers";

const authRouter = Router();

authRouter.post("/signup", userSignupController);
authRouter.post("/login", userLoginController);
authRouter.get("/getall", authenticateToken, getAll);

export default authRouter;