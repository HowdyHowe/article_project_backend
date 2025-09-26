import { Router } from "express";
import { userSignup, userLogin, getAll } from "../controllers/authControllers";

const authRouter = Router();

authRouter.post("/signup", userSignup);
authRouter.post("/login", userLogin)
authRouter.get("/getall", getAll)

export default authRouter;