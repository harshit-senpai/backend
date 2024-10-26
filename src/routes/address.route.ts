import express from "express";
import {
  createAddress,
  getUserAddresses,
  getUserAddressesById,
  updateUserAddress,
} from "../controllers/address.controller";

const router = express.Router();

router.route("/").get(getUserAddresses).post(createAddress);
router.route("/:addressId").get(getUserAddressesById).patch(updateUserAddress);

export default router;
