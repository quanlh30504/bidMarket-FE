import React, { useState, useEffect } from "react";
import { PhotoUpload } from "../components/PhotoUpload";
import { ProductDetails } from "../components/ProductDetails";
import { ItemSpecifics } from "../components/ItemSpecifics";
import { AuctionSettings } from "../components/AuctionSettings";
import { CreationAgreement } from "../components/CreationAgreement";
import ProductService from "../../../services/productService";
import ProductCreateRequest from "../../../dto/Request/ProductCreateRequest";
import AuctionCreateRequest from "../../../dto/Request/AuctionCreateRequest";
import { useUser, useWarning } from "../../../router";
import { useNotification } from "../../../notifications/NotificationContext";
import AuctionService from "../../../services/auctionService";
import { useNavigate, useParams } from "react-router-dom";
import { SelectProductPopup } from "../components/SelectProductPopup";
import ProductImageDto from '../../../dto/ProductImageDto';

export const CreateAuction = () => {
  const navigate = useNavigate();
  const { showWarning } = useWarning();
  const { showToastNotification } = useNotification();
  const { productId } = useParams();
  const [isEditingProductDetails, setIsEditingProductDetails] = useState(true);
  const [productDetails, setProductDetails] = useState({
    id: null,
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
  const [showPopup, setShowPopup] = useState(false);
  const [isProductSelected, setIsProductSelected] = useState(false); // Kiểm tra sản phẩm đã được chọn chưa
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
    showWarning(
      <div className="text-lg font-semibold mb-2 text-center">
          You are about to create a new auction. <br />
          Make sure all the details are correct before proceeding.
      </div>,
      async () => {
        try {
          setLoading(true);
    
          const productImageDtos = await getProductImageDtos();
          console.log('productImageDtos:', productImageDtos);
    
          const productCreateRequest = new ProductCreateRequest({
            productId: productDetails.id,
            name: productDetails.title,
            description: JSON.stringify(productDetails.specifics),
            sellerId: UUID,
            stockQuantity: productDetails.stockQuantity,
            categories: new Set(productDetails.itemCategory),
            productImages: productImageDtos,
          });
    
          productCreateRequest.validate();
    
          const auctionCreateRequest = new AuctionCreateRequest({
            title: auctionSettings.title,
            productCreateRequest: productCreateRequest,
            startTime: auctionSettings.startTime,
            endTime: auctionSettings.endTime,
            currentPrice: auctionSettings.startPrice,
            startingPrice: auctionSettings.startPrice,
            minimumBidIncrement: auctionSettings.minimumBidIncrement,
            extensionCount: 0,
          });
    
          auctionCreateRequest.validate();
    
          await AuctionService.createAuction(auctionCreateRequest);
          showToastNotification('Auction created successfully.', 'success');
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

  const handleProductSelect = async (product) => {
    let initialDetails = {
      id: product.hidden_id,
      title: product.product,
      itemCategory: product.categories,
      specifics: product.hidden_specifics,
      stockQuantity: product.hidden_stockQuantity,
      photos: [],
      videos: [],
      photoPrimaryIndex: 0,
    };

    // Phân loại photos và videos từ `productImages`
    if (product.hidden_productImages) {
      product.hidden_productImages.forEach((productImageDto, index) => {
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
    setIsEditingProductDetails(false);
    setIsProductSelected(true);
  };

  const handleCancelProductSelection = () => {
    setProductDetails({
      id: null,
      title: '',
      itemCategory: [],
      specifics: {},
      stockQuantity: 1,
      photos: [],
      videos: [],
    });
    setIsEditingProductDetails(true);
    setIsProductSelected(false);
  };

  useEffect(() => {
    const fetchAuctionAndLoadAssets = async () => {
      setLoading(true);
      try {
        // Lấy dữ liệu sản phẩm từ API
        const product = (await ProductService.getProduct(productId)).data;
        console.log('Product:', product);
  
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
        setIsEditingProductDetails(false);
      } catch (error) {
        console.error('Error fetching product or loading assets:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAuctionAndLoadAssets();
  }, [productId]);  

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow">
      <h1 className="text-3xl font-semibold mb-6 text-center">Create your Auction</h1>

      <div className="flex justify-end gap-4">
        {!productId && isEditingProductDetails && (
          <button
            className="border py-1 px-4 rounded-full bg-green"
            onClick={() => setShowPopup(true)}
            disabled={loading}
          >
            Select available product
          </button>
        )}

        {!productId && isProductSelected && (
          <button
            className="border py-1 px-4 rounded-full bg-red-500 text-white"
            onClick={handleCancelProductSelection}
            disabled={loading}
          >
            Cancel Selection
          </button>
        )}
      </div>

      {showPopup && (
        <SelectProductPopup
          onSelect={handleProductSelect}
          onClose={() => setShowPopup(false)}
        />
      )}

      <PhotoUpload
        productDetails={productDetails}
        setProductDetails={setProductDetails}
        disabled={!isEditingProductDetails}
      />
      <ProductDetails
        productDetails={productDetails}
        setProductDetails={setProductDetails}
        disabled={!isEditingProductDetails}
      />
      <ItemSpecifics
        productDetails={productDetails}
        setProductDetails={setProductDetails}
        disabled={!isEditingProductDetails}
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
          disabled={!isEditingProductDetails}
        />
      </div>
      <AuctionSettings auctionSettings={auctionSettings} setAuctionSettings={setAuctionSettings} />
      <CreationAgreement createButtonName="Create auction" />

      <div className="mt-8 flex flex-col space-y-2 items-center">
        <button
          className="w-52 py-2 bg-green border border-gray-300 rounded-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          Create auction
        </button>
        {/* <button
          className="w-52 py-2 bg-gray-100 border border-gray-300 rounded-full"
          disabled={loading}
        >
          Save for later
        </button> */}
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
