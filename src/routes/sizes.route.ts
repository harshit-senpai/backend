import express from "express";
import {
  createSize,
  deleteSize,
  getAllSizes,
  getSizeById,
  updateSize,
} from "../controllers/size.controller";

const router = express.Router();

router.route("/").get(getAllSizes).post(createSize);
router.route("/:sizeId").get(getSizeById).patch(updateSize).delete(deleteSize);

export default router;
