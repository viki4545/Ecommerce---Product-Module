import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct, editProduct } from "../features/productSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AppDispatch } from "../app/store";
import { toast } from "react-hot-toast"; // Import react-hot-toast

interface Product {
  id?: number;
  sku: string;
  name: string;
  price: number;
  images: File[] | string[];
}

interface Props {
  product?: Product;
  onClose: () => void;
}

const ProductForm: React.FC<Props> = ({ product, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images?.map(
      (img) => `https://ecommerce-product-module.onrender.com${img}`,
    ) || [],
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState<string>("");

  const initialValues: Product = {
    sku: product?.sku || "",
    name: product?.name || "",
    price: product?.price || 0,
    images: [],
  };

  const validationSchema = Yup.object({
    sku: Yup.string().required("SKU is required"),
    name: Yup.string().required("Name is required"),
    price: Yup.number()
      .positive("Price must be greater than zero")
      .required("Price is required"),
  });

  const handleSubmit = (values: Product) => {
    const formData = new FormData();
    formData.append("sku", values.sku);
    formData.append("name", values.name);
    formData.append("price", values.price.toString());

    newImages.forEach((file) => {
      formData.append("images", file);
    });

    existingImages.forEach((image) => {
      formData.append(
        "existingImages",
        image.replace("https://ecommerce-product-module.onrender.com", ""),
      );
    });

    if (product?.id) {
      formData.append("id", product.id.toString());
      dispatch(editProduct({ id: product.id, formData }))
        .then(() => {
          toast.success("Product updated successfully!");
          onClose();
        })
        .catch(() => {
          toast.error("Failed to update product!");
        });
    } else {
      dispatch(addProduct(formData))
        .then(() => {
          toast.success("Product added successfully!");
          onClose();
        })
        .catch(() => {
          toast.error("Failed to add product!");
        });
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
  ) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);

      const totalImages =
        existingImages.length + newImages.length + fileArray.length;
      if (totalImages > 5) {
        setImageError("You can upload a maximum of 5 images.");
        return;
      }

      setImageError("");
      setFieldValue("images", fileArray);
      setNewImages([...newImages, ...fileArray]);
    }
  };

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter((img) => img !== imageUrl));
  };

  return (
    <div className="w-full max-w-lg rounded-lg border border-[#012647] bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold text-[#012647]">
        {product ? "Edit" : "Add"} Product
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#012647]">
                SKU
              </label>
              <Field
                type="text"
                name="sku"
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-[#75000e]"
                placeholder="Enter SKU"
              />
              <ErrorMessage
                name="sku"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#012647]">
                Name
              </label>
              <Field
                type="text"
                name="name"
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-[#75000e]"
                placeholder="Enter Product Name"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#012647]">
                Price
              </label>
              <Field
                type="number"
                name="price"
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-[#75000e]"
                placeholder="Enter Price"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#012647]">
                Upload Images
              </label>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e, setFieldValue)}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-[#75000e]"
              />
              {imageError && (
                <p className="text-sm text-red-500">{imageError}</p>
              )}

              {existingImages.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {existingImages.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt="Existing Preview"
                        className="h-16 w-full rounded-md border border-[#012647] object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(src)}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs text-white shadow-md transition hover:bg-gray-700"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {newImages.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {newImages.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt="New Preview"
                      className="w-18 h-16 rounded-md border border-[#012647] object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#75000e] px-4 py-2 text-white transition hover:bg-[#56000b]"
              >
                Save Product
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;
