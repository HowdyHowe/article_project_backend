import { Router } from "express";
import { userSignup, userLogin, getAll } from "../controllers/authControllers";

const router = Router();

router.post("/signup", userSignup);
router.post("/login", userLogin)
router.get("/getall", getAll)

export default router;