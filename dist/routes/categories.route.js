"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categories_controller_1 = require("../controllers/categories.controller");
const router = express_1.default.Router();
router.route("/").get(categories_controller_1.getAllCategories).post(categories_controller_1.createCategory);
router
    .route("/:categoryId")
    .get(categories_controller_1.getCategoryById)
    .patch(categories_controller_1.updateCategory)
    .delete(categories_controller_1.deleteCategory);
exports.default = router;
