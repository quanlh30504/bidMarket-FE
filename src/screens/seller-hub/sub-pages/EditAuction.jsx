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
import ProductImageDto from '../../../dto/ProductImageDto';
import { useWarning } from "../../../router";
import { useNotification } from "../../../notifications/NotificationContext";

export const EditAuction = () => {
  const { showToastNotification } = useNotification();
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { showWarning } = useWarning();
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

  // const getProductImageDtos = async () => {
  //   setLoading(true);
  //   let productImageDtos = [];
  //   const photoPromises = productDetails.photos.map((photo, index) =>
  //     ProductService.getUploadedImageUrl(photo, 'products/photos').then((url) => {
  //       return new ProductImageDto({
  //         imageUrl: url,
  //         isPrimary: index === productDetails.photoPrimaryIndex,
  //       });
  //     })
  //   );

  //   const videoPromises = productDetails.videos.map((video) =>
  //     ProductService.getUploadedImageUrl(video, 'products/videos').then((url) => {
  //       return new ProductImageDto({
  //         imageUrl: url,
  //         isPrimary: false,
  //       });
  //     })
  //   );

  //   productImageDtos = await Promise.all([...photoPromises, ...videoPromises]);
  //   setLoading(false);
  //   return productImageDtos;
  // };

  const getProductImageDtos = async () => {
    setLoading(true);
    let productImageDtos = [];
    const photoPromises = productDetails.photos.map( async (photo, index) => {
      if (photo instanceof File) {
        return ProductService.getUploadedImageUrl(photo, 'products/photos').then((url) => {
          return new ProductImageDto({
            imageUrl: url,
            isPrimary: index === productDetails.photoPrimaryIndex,
          });
        });
      } else if (typeof photo === "string") {
        return Promise.resolve(
          new ProductImageDto({
            imageUrl: photo,
            isPrimary: index === productDetails.photoPrimaryIndex,
          })
        );
      }
      return Promise.resolve(null);
    });

    // Chờ tất cả promises hoàn thành
    const results = await Promise.all([...photoPromises]);
  
    // Loại bỏ các phần tử null (nếu có)
    productImageDtos = results.filter((item) => item !== null);
  
    setLoading(false);
    return productImageDtos;
  };
  

  const handleSubmit = async () => {
    showWarning(
      <div className="text-lg font-semibold mb-2 text-center">
          You are about to update this auction. <br />
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
    
          await AuctionService.updateAuction(auctionId, auctionUpdateRequest);
          // window.alert('Product updated successfully');
          showToastNotification('Product updated successfully', 'success');
        } catch (error) {
          console.error('Error updating product:', error);
          // window.alert('Error updating product. Please try again later');
          showToastNotification('Error updating product. Please try again later', 'error');
        } finally {
          setLoading(false);
          navigate('/seller-hub/listings');
        }
      }
    );
  };

  useEffect(() => {
    const fetchAuctionAndLoadAssets = async () => {
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
          specifics: JSON.parse(product.description), // Convert JSON string to object
          stockQuantity: product.stockQuantity,
          photos: product.productImages?.map((productImageDto) => productImageDto.imageUrl),
          videos: [],
          photoPrimaryIndex: 0,
        });

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
  
    fetchAuctionAndLoadAssets();
  }, [auctionId]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        You are editing auction: <span className="text-green">{currentTitle}</span>
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
          {loading ? 'Updating...' : 'Update auction'}
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
