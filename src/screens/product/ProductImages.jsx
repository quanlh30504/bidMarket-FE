import React, { useState } from "react";

const ProductImages = ({ images }) => {
  // Link URL mặc định
  const defaultImageUrl = "https://via.placeholder.com/400x400?text=No+Image";

  // Xử lý mảng images hoặc fallback về ảnh mặc định
  const validImages = images && images.length > 0 ? images : [{ imageUrl: defaultImageUrl }];

  const [selectedImage, setSelectedImage] = useState(
    validImages.find((image) => image.isPrimary)?.imageUrl || validImages[0].imageUrl
  );

  return (
    <div className="flex flex-col items-center">
      {/* Image gallery */}
      <div className="flex">
        {/* Thumbnails */}
        <div className="flex flex-col space-y-4 mr-8 p-2 border border-gray-200 rounded-md shadow-md bg-white">
          {validImages.map((image, index) => (
            <img
              key={index}
              src={image.imageUrl}
              alt={`Thumbnail ${index + 1}`}
              className={`w-20 h-20 object-cover rounded-md border-2 
                          cursor-pointer hover:opacity-90 
                          ${
                            selectedImage === image.imageUrl
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
              onClick={() => setSelectedImage(image.imageUrl)} // Set image on click
            />
          ))}
        </div>

        {/* Main image with hover zoom */}
        <div className="relative w-[400px] h-[400px] border border-gray-200 rounded-lg shadow-lg overflow-hidden group">
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        </div>
      </div>

      {/* Product info */}
      <div className="mt-6 text-red-600 font-bold text-lg">
        IN {validImages.length} CARTS
      </div>
    </div>
  );
};

export default ProductImages;
