import React, { useState } from 'react';
import { PhotoUpload } from '../components/PhotoUpload';
import { ProductDetails } from '../components/ProductDetails';
import { ItemSpecifics } from '../components/ItemSpecifics';
import { CreationAgreement } from '../components/CreationAgreement';
import ProductService from '../../../services/productService';
import ProductCreateRequest from '../../../dto/Request/ProductCreateRequest';
import { useUser, useWarning } from '../../../router';
import { useNotification } from '../../../notifications/NotificationContext';
import { useNavigate } from 'react-router-dom';
import ProductImageDto from '../../../dto/ProductImageDto';

export const CreateProduct = () => {
  const navigate = useNavigate();
  const { showWarning } = useWarning();
  const { showToastNotification } = useNotification();
  const [productDetails, setProductDetails] = useState({
    title: '',
    itemCategory: [],
    specifics: {},
    stockQuantity: 1,
    photos: [],
    videos: [],
    photoPrimaryIndex: 0,
  });
  const [loading, setLoading] = useState(false);
  const UUID = useUser().user.UUID;

  const getProductImageDtos = async () => {
    setLoading(true);
    let productImageDtos = [];
    const photoPromises = productDetails.photos.map((photo, index) =>
      ProductService.getUploadedImageUrl(photo, 'products/photos').then((url) => {
        return new ProductImageDto({
          imageUrl: url,
          isPrimary: index === productDetails.photoPrimaryIndex,
        });
      })
    );

    const videoPromises = productDetails.videos.map((video) =>
      ProductService.getUploadedImageUrl(video, 'products/videos').then((url) => {
        return new ProductImageDto({
          imageUrl: url,
          isPrimary: false,
        });
      })
    );

    productImageDtos = await Promise.all([...photoPromises, ...videoPromises]);
    setLoading(false);
    return productImageDtos;
  };

  const handleSubmit = async () => {
    //confirm
    showWarning(
      <div className="text-lg font-semibold mb-2 text-center">
          You are about to create a new product. <br />
          Make sure all the details are correct before proceeding.
      </div>,
      async () => {
        try {
          setLoading(true);
          console.log('Creating product...');
          console.log('productDetails:', productDetails);
    
          const productImageDtos = await getProductImageDtos();
          console.log('productImageDtos:', JSON.stringify(productImageDtos));
          const productCreateRequest = new ProductCreateRequest({
            name: productDetails.title,
            description: JSON.stringify(productDetails.specifics), // Convert to JSON string
            sellerId: UUID,
            stockQuantity: productDetails.stockQuantity,
            categories: new Set(productDetails.itemCategory),
            productImages: productImageDtos,
          });
          console.log('productCreateRequest:', JSON.stringify(productCreateRequest));
          productCreateRequest.validate();
          await ProductService.createProduct(productCreateRequest);
          showToastNotification('Product created successfully.', 'success');
        } catch (error) {
          console.error('Error creating product:', error);
          showToastNotification('Error creating product', 'error');
        } finally {
          setLoading(false);
          navigate('/seller-hub/listings');
        }
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow">
      <h1 className="text-3xl font-semibold mb-6 text-center">Create your product</h1>
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
      <CreationAgreement createButtonName="Create product" />

      <div className="mt-8 flex flex-col space-y-2 items-center">
        <button
          className={`w-52 px-4 py-2 ${loading ? 'bg-gray-300' : 'bg-green'} border border-gray-300 rounded-full`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create product'}
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