"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const size_controller_1 = require("../controllers/size.controller");
const router = express_1.default.Router();
router.route("/").get(size_controller_1.getAllSizes).post(size_controller_1.createSize);
router.route("/:sizeId").get(size_controller_1.getSizeById).patch(size_controller_1.updateSize).delete(size_controller_1.deleteSize);
exports.default = router;
