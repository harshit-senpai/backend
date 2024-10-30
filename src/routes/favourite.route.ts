import express from "express";
import {
  addToFavourite,
  getFavourites,
  removeFavourite,
} from "../controllers/favourite.controller";

const router = express.Router();

router.route("/:userId").get(getFavourites);
router
  .route("/:userId/:productId")
  .post(addToFavourite)
  .delete(removeFavourite);

export default router;
