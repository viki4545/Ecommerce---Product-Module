// backend/src/services/ProductService.ts
import { AppDataSource } from "../config/data-source";
import { Product } from "../entity/Product";

const productRepository = AppDataSource.getRepository(Product);

export const createProduct = async (
  data: Partial<Product>,
): Promise<Product> => {
  const newProduct = productRepository.create(data);
  return await productRepository.save(newProduct);
};

export const getAllProducts = async (
  searchQuery: string = "",
  page: number = 1,
  limit: number = 10,
): Promise<{
  products: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
}> => {
  const offset = (page - 1) * limit; // Calculate offset for pagination

  const queryBuilder = productRepository.createQueryBuilder("product");

  if (searchQuery) {
    queryBuilder.where(
      "LOWER(product.sku) LIKE :search OR LOWER(product.name) LIKE :search",
      { search: `%${searchQuery.toLowerCase()}%` },
    );
  }

  const total = await queryBuilder.getCount();

  const products = await queryBuilder
    .orderBy("product.id", "DESC") // Sort by latest products
    .skip(offset) // Skip previous pages
    .take(limit) // Limit results per page
    .getMany();

  return {
    products,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getProductById = async (id: number): Promise<Product | null> => {
  return await productRepository.findOneBy({ id });
};

export const updateProduct = async (
  id: number,
  data: Partial<Product>,
): Promise<Product | null> => {
  await productRepository.update(id, data);
  return await productRepository.findOneBy({ id });
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const result = await productRepository.delete(id);
  return result.affected !== 0;
};
