import express from "express";
import {
  createAddress,
  getUserAddresses,
  getUserAddressesById,
  setUserAddress,
  updateUserAddress,
} from "../controllers/address.controller";

const router = express.Router();

router.route("/").get(getUserAddresses).post(createAddress);
router.route("/:addressId").get(getUserAddressesById).patch(updateUserAddress);
router.route("/set-address/:userId/:addressId").patch(setUserAddress);

export default router;
