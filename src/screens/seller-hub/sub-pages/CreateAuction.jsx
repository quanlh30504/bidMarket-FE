import React, { useState } from "react";
import { PhotoUpload } from "../components/PhotoUpload";
import { ProductDetails } from "../components/ProductDetails";
import { ItemSpecifics } from "../components/ItemSpecifics";
import { AuctionSettings } from "../components/AuctionSettings";
import { CreationAgreement } from "../components/CreationAgreement";

export const CreateAuction = () => {
  const [productDetails, setProductDetails] = useState({
    title: "",
    itemCategory: {},
    specifics: {},
    photos: [],
  });

  const [auctionSettings, setAuctionSettings] = useState({
    title: "",
    startTime: "",
    endTime: "",
    startPrice: "",
    minimumBidIncrement: "",
  });

  const handleSubmit = (e) => {
    console.log("Create Auction Data:", {
      productDetails,
      auctionSettings,
    });
    // API call
  };

  function handleSelectProduct(e) {
    // API call
    // sample response
    const responseProductDetails = {
      title: "Apple Watch Series 4 40mm GPS",
      itemCategory: {
        COINS: 'Coins',
        METALWARE: 'Metalware',
      },
      specifics: {},
      photos: [],
    };
    setProductDetails(responseProductDetails);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Create your product
      </h1>
      <div className="flex justify-end">
        <button
          className="border py-1 px-4 rounded-full bg-green"
          onClick={handleSelectProduct}
        >
          Select available product
        </button>
      </div>

      <PhotoUpload
        productDetails={productDetails}
        setProductDetails={setProductDetails}
      />
      <ProductDetails
        productDetails={productDetails}
        setProductDetails={setProductDetails}
      />
      <ItemSpecifics
        productDetails={productDetails}
        setProductDetails={setProductDetails}
      />
      <AuctionSettings
        auctionSettings={auctionSettings}
        setAuctionSettings={setAuctionSettings}
      />
      <CreationAgreement createButtonName="Create auction" />

      <div className="mt-8 flex flex-col space-y-2 items-center">
        <button
          className="w-52 py-2 bg-green border border-gray-300 rounded-full"
          onClick={handleSubmit}
        >
          Create auction
        </button>
        <button className="w-52 py-2 bg-gray-100 border border-gray-300 rounded-full">
          Save for later
        </button>
        <button className="w-52 py-2 bg-gray-100 border border-gray-300 rounded-full">
          Cancel
        </button>
      </div>
    </div>
  );
};
