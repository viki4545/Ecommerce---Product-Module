// src/features/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  images: string[];
}

interface ProductState {
  products: Product[];
  total: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: ProductState = {
  products: [],
  total: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

const BASE_URL = "https://ecommerce-product-module.onrender.com/products";

export const fetchProducts = createAsyncThunk<
  {
    products: Product[];
    total: number;
    currentPage: number;
    totalPages: number;
  },
  { searchQuery: string; page: number; limit: number }
>(
  "product/fetchProducts",
  async ({ searchQuery, page, limit }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/get-all-product`, {
        params: { search: searchQuery, page, limit },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const addProduct = createAsyncThunk<Product, FormData>(
  "product/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/add-product`, product);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product",
      );
    }
  },
);

export const editProduct = createAsyncThunk<
  Product,
  { id: number; formData: FormData }
>("product/editProduct", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to edit product",
    );
  }
});

export const deleteProduct = createAsyncThunk<number, number>(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/delete-product/${productId}`);
      return productId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (
          state,
          action: PayloadAction<{
            products: Product[];
            total: number;
            currentPage: number;
            totalPages: number;
          }>,
        ) => {
          state.loading = false;
          state.products = action.payload.products;
          state.total = action.payload.total;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
        },
      )

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add Product Cases
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.products.push(action.payload);
        },
      )

      // Edit Product Cases
      .addCase(
        editProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.products.findIndex(
            (p) => p.id === action.payload.id,
          );
          if (index !== -1) state.products[index] = action.payload;
        },
      )

      // Delete Product Cases
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.products = state.products.filter(
            (p) => p.id !== action.payload,
          );
        },
      );
  },
});

export default productSlice.reducer;
