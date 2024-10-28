import express from "express";

import categoriesRouter from "./routes/categories.route";
import imageUploadRouter from "./routes/imageUpload.route";
import productsRouter from "./routes/products.route";
import analyticsRouter from "./routes/analytics.route";
import ordersRouter from "./routes/orders.route";
import sizesRouter from "./routes/sizes.route";
import addressRouter from "./routes/address.route";
import searchRouter from "./routes/search.route";

const app = express();
app.use(express.json());

app.use("/api/categories", categoriesRouter);
app.use("/api/image-upload", imageUploadRouter);
app.use("/api/products", productsRouter);
app.use("/api/sizes", sizesRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/address", addressRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/search", searchRouter);

export default app;
