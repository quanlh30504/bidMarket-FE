import React from 'react';

// Chưa xử lý max number of photos
export const PhotoUpload = ({ productDetails, setProductDetails }) => {
  const handlePhotoUpload = (event) => {
    const uploadedPhotos = Array.from(event.target.files);
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      photos: [...prevDetails.photos, ...uploadedPhotos],
    }));
  };

  const handlePhotoDelete = (index) => {
    const updatedPhotos = productDetails.photos.filter((_, photoIndex) => photoIndex !== index);
    setProductDetails({ ...productDetails, photos: updatedPhotos });
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">PHOTO & VIDEO</h2>
      <p>{productDetails.photos.length} of 24 photos</p>
      <div className="flex justify-between mt-4">
        <div className="w-3/5 h-48 border border-dashed rounded-xl flex items-center justify-center">
          <input type="file" multiple onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
          <label htmlFor="photo-upload" className="cursor-pointer">Add photos or drag and drop</label>
        </div>
        <div className="w-2/5 h-48 border border-dashed rounded-xl flex items-center justify-center ml-4">
          <input type="file" accept="video/*" className="hidden" id="video-upload" />
          <label htmlFor="video-upload" className="cursor-pointer">Add video or drag and drop</label>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {productDetails.photos.map((photo, index) => (
          <div key={index} className="w-full border rounded-lg overflow-hidden relative">
            <img src={URL.createObjectURL(photo)} alt={`${index + 1}`} className="w-full h-full object-cover" />
            <button
              className="absolute top-2 right-2"
              onClick={() => handlePhotoDelete(index)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke='red' xmlns="http://www.w3.org/2000/svg" width='20' height='20'><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 16L8.29289 11.7071C8.68342 11.3166 9.31658 11.3166 9.70711 11.7071L13 15M13 15L15.7929 12.2071C16.1834 11.8166 16.8166 11.8166 17.2071 12.2071L20 15M13 15L15.25 17.25" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M17 3L19 5M21 7L19 5M19 5L21 3M19 5L17 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
