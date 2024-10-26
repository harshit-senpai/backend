"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const router = express_1.default.Router();
router.route("/").get(product_controller_1.getAllProducts).post(product_controller_1.createProduct);
router
    .route("/:productId")
    .get(product_controller_1.getProductById)
    .patch(product_controller_1.updateProduct)
    .delete(product_controller_1.deleteProduct);
exports.default = router;
