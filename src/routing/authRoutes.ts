import { Router } from "express";
import { userSignup, userLogin } from "../controllers/authControllers";

const router = Router();

router.post("/signup", userSignup);
router.post("/login", userLogin)

export default router;