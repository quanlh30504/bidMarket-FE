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
import ProductImageDto from '../../../dto/ProductImageDto';
import { useWarning } from "../../../router";

export const ReopenAuction = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { showWarning } = useWarning();
  const { showToastNotification } = useNotification();
  const [currentTitle, setCurrentTitle] = useState("");
  const [productDetails, setProductDetails] = useState({
    title: '',
    itemCategory: [],
    specifics: {},
    stockQuantity: 1,
    photos: [],
    videos: [],
    photoPrimaryIndex: 0,
  });

  const [auctionSettings, setAuctionSettings] = useState({
    title: "",
    startTime: "",
    endTime: "",
    startPrice: "",
    minimumBidIncrement: "",
  });

  const [loading, setLoading] = useState(false);

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
    showWarning(
      <div className="text-lg font-semibold mb-2 text-center">
          You are about to reopen this auction. <br />
          Make sure all the details are correct before proceeding.
      </div>,
      async () => {
        try {
          setLoading(true);
          console.log('Updating product:', productDetails);
    
          const productImageDtos = await getProductImageDtos();
    
    
          const productUpdateRequest = new ProductUpdateRequest({
            name: productDetails.title,
            description: JSON.stringify(productDetails.specifics),  // Convert object to JSON string
            stockQuantity: productDetails.stockQuantity,
            categories: Array.from(new Set(productDetails.itemCategory)),
            productImages: productImageDtos,
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
      }
    );
  };

  useEffect(() => {
    const loadFilesFromUrls = async (urls) => {
      const files = await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url);
          const blob = await response.blob();
          const fileName = url.split('/').pop(); // Lấy tên file từ URL
          return new File([blob], fileName, { type: blob.type });
        })
      );
      return files;
    };

    const fetchProductAndLoadAssets = async () => {
      setLoading(true);
      try {
        // Lấy dữ liệu sản phẩm từ API
        const auction = (await AuctionService.getAuctionById(auctionId)).data;
        const product = (await ProductService.getProduct(auction.productDto.id)).data; // api get auction không trả về product
        console.log('Auction:', auction);
        console.log('Product:', product);
        setCurrentTitle(auction.title);
  
        // Cập nhật thông tin cơ bản của sản phẩm
        let initialDetails = {
          title: product.name,
          itemCategory: product.categories,
          specifics: JSON.parse(product.description), // Convert JSON string to object
          stockQuantity: product.stockQuantity,
          photos: [],
          videos: [],
          photoPrimaryIndex: 0,
        };
  
        // Phân loại photos và videos từ `productImages`
        if (product.productImages) {
          product.productImages.forEach((productImageDto, index) => {
            const { imageUrl, isPrimary } = productImageDto;
            console.log('imageUrl:', imageUrl);
            const prefix = imageUrl.includes('/photos/') ? 'photos' : 
                           imageUrl.includes('/videos/') ? 'videos' : null;
  
            if (prefix) {
              initialDetails[prefix].push(imageUrl);
  
              if (isPrimary && prefix === 'photos') {
                initialDetails.photoPrimaryIndex = index;
              }
            }
          });
        }
  
        // Tải và chuyển đổi URLs thành File
        const [photoFiles, videoFiles] = await Promise.all([
          loadFilesFromUrls(initialDetails.photos),
          loadFilesFromUrls(initialDetails.videos),
        ]);
        
        initialDetails.photos = photoFiles;
        initialDetails.videos = videoFiles;
  
        // Cập nhật `productDetails` với Files
        setProductDetails(initialDetails);
        setAuctionSettings({
          title: auction.title,
          startTime: new Date(auction.startTime),
          endTime: new Date(auction.endTime),
          startPrice: auction.startingPrice,
          minimumBidIncrement: auction.minimumBidIncrement,
        });
      } catch (error) {
        console.error('Error fetching product or loading assets:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProductAndLoadAssets();
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
