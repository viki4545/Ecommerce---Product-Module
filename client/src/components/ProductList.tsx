import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchProducts, deleteProduct } from "../features/productSlice";
import { useState, useEffect } from "react";
import ProductForm from "./ProductForm";

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, totalPages, loading, error } = useSelector(
    (state: RootState) => state.product,
  );

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [page, setPage] = useState(1);

  const handleOpenModal = (product?: any) => {
    setSelectedProduct(product || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      fetchProducts({ searchQuery: debouncedSearch, page, limit: 10 }) as any,
    );
  }, [dispatch, debouncedSearch, page]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-[#012647] p-6">
      <h1 className="mb-6 text-center text-3xl font-bold text-[#ffffff]">
        Product Management
      </h1>
      <div className="w-full max-w-6xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <input
            type="text"
            placeholder="Search by SKU or Name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Reset to first page on new search
            }}
            className="w-full rounded-md border p-2 outline-none focus:ring-2 focus:ring-[#012647] sm:w-2/3"
          />
          <button
            className="w-full rounded-md bg-[#75000e] px-4 py-2 font-semibold text-white transition hover:bg-[#012647] sm:w-auto"
            onClick={() => handleOpenModal()}
          >
            + Add Product
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border bg-white shadow-lg">
            <thead>
              <tr className="bg-[#012647] text-sm uppercase text-white">
                <th className="border px-4 py-2 font-semibold">SKU</th>
                <th className="border px-4 py-2 font-semibold">Name</th>
                <th className="border px-4 py-2 font-semibold">Price</th>
                <th className="border px-4 py-2 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products?.map((product) => (
                  <tr
                    key={product.id}
                    className="border text-center transition hover:bg-gray-50"
                  >
                    <td className="border px-4 py-2">{product.sku}</td>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2 font-semibold text-[#012647]">
                      ₹{product.price}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="rounded-md bg-[#012647] px-4 py-2 font-normal text-[#ffffff] transition hover:bg-[#75000e]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => dispatch(deleteProduct(product.id))}
                        className="ml-4 rounded-md bg-[#75000e] px-4 py-2 font-normal text-[#ffffff] transition hover:bg-[#012647]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No matching products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-between gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`rounded-md px-4 py-2 text-white ${
                page === 1
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-[#012647] hover:bg-[#01407a]"
              }`}
            >
              Prev
            </button>
            <span className="flex items-center px-4 py-2 text-[#012647]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`rounded-md px-4 py-2 text-white ${
                page === totalPages
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-[#012647] hover:bg-[#01407a]"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-[#012647]">
              {selectedProduct?.id ? "Edit Product" : "Add Product"}
            </h2>
            <ProductForm product={selectedProduct} onClose={handleCloseModal} />
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full rounded-md bg-[#75000e] py-2 text-white transition hover:bg-[#56000b]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
