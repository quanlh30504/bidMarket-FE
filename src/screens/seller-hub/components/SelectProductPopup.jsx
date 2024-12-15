import React, { useState, useEffect } from "react";
import { Table } from "./Table";
import ProductService from "../../../services/productService";
import { useUser } from "../../../router";
import { ProductStatus } from "../../../router";

export const SelectProductPopup = ({ onSelect, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const formatProductData = (response) => {
    return response.content.map(product => {
      return {
        hidden_id: product.id, // Không hiển thị id
        product: product.name,
        categories: product.categories,
        hidden_status: ProductStatus[product.productStatus] || product.productStatus,
        hidden_specifics: JSON.parse(product.description),
        hidden_stockQuantity: product.stockQuantity,
        hidden_productImages: product.productImages,
      };
    });
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const sellerId = user.UUID;
        const response = await ProductService.searchProducts({
          sellerId,
          status: "INACTIVE",
        });
        setItems(formatProductData(response.data));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSelectProduct = (product) => {
    onSelect(product);
    onClose();
  };

  return (
    <div className="fixed top-5 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full">
        <h2 className="text-xl font-bold mb-4">Select a Product</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <Table
            items={items.map((product) => ({
              ...product,
              actions: (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleSelectProduct(product)}
                >
                  Select
                </button>
              ),
            }))}
          />
        )}
        <button
          className="mt-4 bg-gray-300 px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};
