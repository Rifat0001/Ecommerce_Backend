import express from "express";
import { productControllers } from "./product.controller";

const router = express.Router();

router.post("/products", productControllers.createProduct);

router.get("/products", productControllers.getAllProducts);

router.get("/products/:productId", productControllers.getSingleProduct);

router.put("/products/:productId", productControllers.updateSingleProduct);

router.delete("/products/:productId", productControllers.deleteSingleProduct);

export const ProductRoutes = router;
