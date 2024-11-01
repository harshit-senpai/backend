"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categories_route_1 = __importDefault(require("./routes/categories.route"));
const imageUpload_route_1 = __importDefault(require("./routes/imageUpload.route"));
const products_route_1 = __importDefault(require("./routes/products.route"));
const analytics_route_1 = __importDefault(require("./routes/analytics.route"));
const orders_route_1 = __importDefault(require("./routes/orders.route"));
const sizes_route_1 = __importDefault(require("./routes/sizes.route"));
const address_route_1 = __importDefault(require("./routes/address.route"));
const search_route_1 = __importDefault(require("./routes/search.route"));
// import authRouter from "./routes/auth.route";
const favourite_route_1 = __importDefault(require("./routes/favourite.route"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.use("/api/categories", categories_route_1.default);
app.use("/api/image-upload", imageUpload_route_1.default);
app.use("/api/products", products_route_1.default);
app.use("/api/sizes", sizes_route_1.default);
app.use("/api/analytics", analytics_route_1.default);
app.use("/api/address", address_route_1.default);
app.use("/api/orders", orders_route_1.default);
app.use("/api/search", search_route_1.default);
// app.use("/api/auth", authRouter);
app.use("/api/favourite", favourite_route_1.default);
exports.default = app;
