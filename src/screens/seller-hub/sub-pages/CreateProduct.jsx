import React, { useState } from 'react';
import { PhotoUpload } from '../components/PhotoUpload';
import { ProductDetails } from '../components/ProductDetails';
import { ItemSpecifics } from '../components/ItemSpecifics';
import { CreationAgreement } from '../components/CreationAgreement';

export const CreateProduct = () => {
  const [productDetails, setProductDetails] = useState({
    title: '',
    itemCategory: {},
    specifics: {},
    photos: [],
  });
  
  const handleSubmit = () => {
    console.log('Create Auction Data:', {
      productDetails,
    });
    // API call
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow">
      <h1 className="text-3xl font-semibold mb-6 text-center">Create your product</h1>
      <PhotoUpload productDetails={productDetails} setProductDetails={setProductDetails} />
      <ProductDetails productDetails={productDetails} setProductDetails={setProductDetails} />
      <ItemSpecifics productDetails={productDetails} setProductDetails={setProductDetails} />
      <CreationAgreement createButtonName="Create product" />

      <div className="mt-8 flex flex-col space-y-2 items-center">
        <button className="w-52 px-4 py-2 bg-green border border-gray-300 rounded-full" onClick={handleSubmit}>Create product</button>
        <button className="w-52 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full">Cancel</button>
      </div>
    </div>
  );
};