import "reflect-metadata";
import { DataSource } from "typeorm";
import { Product } from "../entity/Product";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Product], // Path to entity files
  synchronize: true, // Auto-create tables (use only in development)
  logging: true,
});

export const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("PostgreSQL Database Connected Successfully!");
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
};
