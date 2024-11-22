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
        <div className="flex flex-col space-y-3 mr-6">
          {validImages.map((image, index) => (
            <img
              key={index}
              src={image.imageUrl}
              alt={`Thumbnail ${index + 1}`}
              className="w-20 h-20 object-cover border border-gray-300 cursor-pointer hover:border-gray-500"
              onClick={() => setSelectedImage(image.imageUrl)} // Set image on click
            />
          ))}
        </div>

        {/* Main image with hover zoom */}
        <div className="relative w-[400px] h-[400px] border border-gray-300 overflow-hidden group">
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        </div>
      </div>

      {/* Product info */}
      <div className="mt-4 text-red-500 font-bold text-lg">
        IN {validImages.length} CARTS
      </div>
    </div>
  );
};

export default ProductImages;
