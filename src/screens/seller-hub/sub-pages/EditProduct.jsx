import React, { useState, useEffect } from 'react';
import { PhotoUpload } from '../components/PhotoUpload';
import { ProductDetails } from '../components/ProductDetails';
import { ItemSpecifics } from '../components/ItemSpecifics';
import ProductService from '../../../services/productService';
import ProductUpdateRequest from '../../../dto/Request/ProductUpdateRequest';
import { useNavigate, useParams } from 'react-router-dom';

export const EditProduct = () => {
  const { productId } = useParams();
  // console.log('productId:', productId);
  const navigate = useNavigate();
  const [currentTitle, setCurrentTitle] = useState('');
  const [productDetails, setProductDetails] = useState({
    title: '',
    itemCategory: [],
    specifics: {},
    stockQuantity: 1,
    photos: [],
    videos: [],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log('Updating product:', productDetails);

      // let imageUrls = [];
      // if (productDetails.photos) {
      //   imageUrls = await ProductService.getUploadedImageUrls(productDetails.photos);
      // }

      const productUpdateRequest = new ProductUpdateRequest({
        name: productDetails.title,
        description: JSON.stringify(productDetails.specifics),  // Convert object to JSON string
        stockQuantity: productDetails.stockQuantity,
        categories: Array.from(new Set(productDetails.itemCategory)),
        productImages: [],  // chưa xử lý
        newImages: [],
      });
      console.log('productUpdateRequest:', JSON.stringify(productUpdateRequest));
      productUpdateRequest.validate();

      await ProductService.updateProduct(productId, productUpdateRequest);
      window.alert('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      window.alert('Error updating product. Please try again later');
    } finally {
      setLoading(false);
      navigate('/seller-hub/listings');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const product = (await ProductService.getProduct(productId)).data;
        console.log('Product:', product);
        setCurrentTitle(product.name);
        setProductDetails({
          title: product.name,
          itemCategory: product.categories,
          specifics: JSON.parse(product.description),  // Convert JSON string to object
          stockQuantity: product.stockQuantity,
        });
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow">
      <h1 className="text-3xl font-semibold mb-6 text-center">You are editing product: <span className="text-green">{currentTitle}</span></h1>
      <PhotoUpload productDetails={productDetails} setProductDetails={setProductDetails} />
      <ProductDetails productDetails={productDetails} setProductDetails={setProductDetails} />
      <ItemSpecifics productDetails={productDetails} setProductDetails={setProductDetails} />
      <div className="mb-10 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">STOCK QUANTITY</h2>
        <input
          type="number"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={productDetails.stockQuantity}
          onChange={(e) => setProductDetails({ ...productDetails, stockQuantity: Number(e.target.value) })}
          min="0"
          placeholder="Enter stock quantity"
        />
      </div>

      <div className="mt-8 flex flex-col space-y-2 items-center">
        <button
          className={`w-52 px-4 py-2 ${loading ? 'bg-gray-300' : 'bg-green'} border border-gray-300 rounded-full`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update product'}
        </button>
        <button 
          className="w-52 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full" 
          onClick={() => navigate('/seller-hub/listings')}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};