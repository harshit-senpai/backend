import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categories.controller";

const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);

router
  .route("/:categoryId")
  .get(getCategoryById)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
