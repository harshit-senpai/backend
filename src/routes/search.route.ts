import express from "express";
import { searchSearch } from "../controllers/search.controller";

const router = express.Router();

router.route("/").get(searchSearch);

export default router;
