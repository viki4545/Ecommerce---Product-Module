import express from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "../controller/ProductController";
import upload from "../middleware/upload";

const productRouter = express.Router();

productRouter.post(
  "/add-product",
  upload.array("images", 5),
  createProductController,
);
productRouter.get("/get-all-product", getAllProductsController);
productRouter.get("/:id", getProductByIdController);
productRouter.post("/:id", upload.array("images", 5), updateProductController);
productRouter.delete("/:id", deleteProductController);

export default productRouter;
