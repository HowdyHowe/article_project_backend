import { Router } from "express";
import { authenticateToken } from "../middlewares/authTokenMiddleware";
import { createCategoryController, deleteCategoryController, getCategoryController, searchCategoryController, updateCategoryController } from "../controllers/categoryControllers";

const categoryRouter = Router();

categoryRouter.post("/addCategory", authenticateToken, createCategoryController);
categoryRouter.get("/searchCategory", authenticateToken, searchCategoryController);
categoryRouter.get("/getCategory", authenticateToken, getCategoryController);
categoryRouter.post("/updateCategory", authenticateToken, updateCategoryController);
categoryRouter.post("/deleteCategory", authenticateToken, deleteCategoryController);

export default categoryRouter;
