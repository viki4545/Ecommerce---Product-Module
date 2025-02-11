import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/data-source";
import productRouter from "./router/productRouter";
import errorHandler from "./middleware/errorHandler";
import { seedDatabase } from "./data/seed";
import path from "path";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "https://ecommerce-product-module.netlify.app",
      "http://localhost:5173",
    ],
  }),
);
app.use(express.json());

connectDB();

// seedDatabase();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/products", productRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
