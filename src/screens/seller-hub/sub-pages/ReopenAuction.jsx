import React, { useState, useEffect } from "react";
import { PhotoUpload } from "../components/PhotoUpload";
import { ProductDetails } from "../components/ProductDetails";
import { ItemSpecifics } from "../components/ItemSpecifics";
import { AuctionSettings } from "../components/AuctionSettings";
import ProductUpdateRequest from "../../../dto/Request/ProductUpdateRequest";
import AuctionUpdateRequest from "../../../dto/Request/AuctionUpdateRequest";
import ProductService from "../../../services/productService";
import AuctionService from "../../../services/auctionService";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../../../notifications/NotificationContext";

export const ReopenAuction = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { showToastNotification } = useNotification();
  const [currentTitle, setCurrentTitle] = useState("");
  const [productDetails, setProductDetails] = useState({
    title: '',
    itemCategory: [],
    specifics: {},
    stockQuantity: 1,
    photos: [],
    videos: [],
  });

  const [auctionSettings, setAuctionSettings] = useState({
    title: "",
    startTime: "",
    endTime: "",
    startPrice: "",
    minimumBidIncrement: "",
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

      const auctionUpdateRequest = new AuctionUpdateRequest({
        title: auctionSettings.title,
        productUpdateRequest: productUpdateRequest,
        startTime: auctionSettings.startTime,
        endTime: auctionSettings.endTime,
        currentPrice: auctionSettings.startPrice,
        startingPrice: auctionSettings.startPrice,
        minimumBidIncrement: auctionSettings.minimumBidIncrement,
        extensionCount: 0,
      });
      console.log('auctionUpdateRequest:', JSON.stringify(auctionUpdateRequest));
      auctionUpdateRequest.validate();

    //   await AuctionService.updateAuction(auctionId, auctionUpdateRequest);
      await AuctionService.reOpenAuction(auctionId, auctionUpdateRequest);
      showToastNotification('Reopened auction successfully', 'success');
    } catch (error) {
      console.error('Error updating product:', error);
      showToastNotification('Failed to reopen auction', 'error');
    } finally {
      setLoading(false);
      navigate('/seller-hub/listings');
    }
  };

  useEffect(() => {
    const fetchAuction = async () => {
      setLoading(true);
      try {
        const auction = (await AuctionService.getAuctionById(auctionId)).data;
        const product = (await ProductService.getProduct(auction.productDto.id)).data; // api get auction không trả về product
        console.log('Auction:', auction);
        console.log('Product:', product);
        setCurrentTitle(auction.title);
        setProductDetails({
          title: product.name,
          itemCategory: product.categories,
          specifics: JSON.parse(product.description),  // Convert JSON string to object
          stockQuantity: product.stockQuantity,
        });
        setAuctionSettings({
          title: auction.title,
          startTime: new Date(auction.startTime),
          endTime: new Date(auction.endTime),
          startPrice: auction.startingPrice,
          minimumBidIncrement: auction.minimumBidIncrement,
        });
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuction();
  }, [auctionId]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        You are reopening the auction: <span className="text-green">{currentTitle}</span>
      </h1>

      <PhotoUpload
        productDetails={productDetails}
        setProductDetails={setProductDetails}
        disabled={true}
      />
      <ProductDetails
        productDetails={productDetails}
        setProductDetails={setProductDetails}
        disabled={true}
      />
      <ItemSpecifics
        productDetails={productDetails}
        setProductDetails={setProductDetails}
        disabled={true}
      />
      <div className="mb-10 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">STOCK QUANTITY</h2>
        <input
          type="number"
          className="border border-gray-300 rounded-md px-4 py-2 w-full"
          value={productDetails.stockQuantity}
          onChange={(e) => setProductDetails({ ...productDetails, stockQuantity: Number(e.target.value) })}
          min="0"
          placeholder="Enter stock quantity"
          disabled={true}
        />
      </div>
      <AuctionSettings
        auctionSettings={auctionSettings}
        setAuctionSettings={setAuctionSettings}
      />

      <div className="mt-8 flex flex-col space-y-2 items-center">
        <button
          className="w-52 py-2 bg-green border border-gray-300 rounded-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Reopen Auction'}
        </button>
        <button
          className="w-52 py-2 bg-gray-100 border border-gray-300 rounded-full"
          onClick={() => navigate('/seller-hub/listings')}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
