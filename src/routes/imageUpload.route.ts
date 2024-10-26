import express from "express";
import { uploadImage } from "../controllers/imageUpload.controller";

const router = express.Router();

router.route("/").post(uploadImage);

export default router;
