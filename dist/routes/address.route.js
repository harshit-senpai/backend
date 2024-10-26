"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const address_controller_1 = require("../controllers/address.controller");
const router = express_1.default.Router();
router.route("/").get(address_controller_1.getUserAddresses).post(address_controller_1.createAddress);
router.route("/:addressId").get(address_controller_1.getUserAddressesById).patch(address_controller_1.updateUserAddress);
exports.default = router;
