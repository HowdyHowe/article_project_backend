import { Router } from "express";
import { userSignup, userLogin, getAll } from "../controllers/authControllers";
import { authenticateToken } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.post("/signup", userSignup);
authRouter.post("/login", userLogin)
authRouter.get("/getall", authenticateToken, getAll)

export default authRouter;