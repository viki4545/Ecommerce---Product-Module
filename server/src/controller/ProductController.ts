import { Request, Response, NextFunction } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/ProductService";

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const { sku, name, price } = req.body;

    const imageFiles = req.files as Express.Multer.File[];

    const images = imageFiles?.map((file) => `/uploads/${file.filename}`);

    const product = await createProduct({ sku, name, price, images });
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getAllProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const searchQuery = (req.query.search as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const products = await getAllProducts(searchQuery, page, limit);
    return res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const product = await getProductById(Number(req.params.id));
    if (!product) return next({ status: 404, message: "Product not found" }); // ✅ Pass error to global handler
    return res.json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const productId = Number(req.params.id);
    const existingProduct = await getProductById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { sku, name, price, existingImages } = req.body;

    let parsedExistingImages: string[] = [];
    if (existingImages) {
      if (typeof existingImages === "string") {
        parsedExistingImages = existingImages.replace(/[{}]/g, "").split(",");
      } else if (Array.isArray(existingImages)) {
        parsedExistingImages = existingImages;
      }
    }
    const imageFiles = req.files as Express.Multer.File[];
    const newImages = imageFiles.map((file) => `/uploads/${file.filename}`);
    const updatedImages = [...parsedExistingImages, ...newImages];
    const updatedProductData = {
      sku,
      name,
      price,
      images: updatedImages,
    };

    const updatedProduct = await updateProduct(productId, updatedProductData);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const success = await deleteProduct(Number(req.params.id));
    if (!success) return next({ status: 404, message: "Product not found" });
    return res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};
