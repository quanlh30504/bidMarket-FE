import React, { useState, useCallback, memo, useMemo } from 'react';

export const PhotoUpload = memo(({ productDetails, setProductDetails, disabled = false }) => {
  const [previewPhoto, setPreviewPhoto] = useState(null);
  // const [previewVideo, setPreviewVideo] = useState(null);

  const photos = useMemo(() => productDetails.photos || [], [productDetails.photos]);
  // const videos = useMemo(() => productDetails.videos || [], [productDetails.videos]);
  const primaryIndex = useMemo(() => productDetails.photoPrimaryIndex || 0, [productDetails.photoPrimaryIndex]);

  // Photo Upload Handlers
  const handlePhotoUpload = useCallback(
    (event) => {
      if (disabled) return; // Vô hiệu hóa thao tác
      const uploadedPhotos = Array.from(event.target.files);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        photos: [...photos, ...uploadedPhotos],
      }));
    },
    [photos, setProductDetails, disabled]
  );

  // Video Upload Handlers
  // const handleVideoUpload = useCallback(
  //   (event) => {
  //     if (disabled) return; // Vô hiệu hóa thao tác
  //     const uploadedVideos = Array.from(event.target.files);
  //     setProductDetails((prevDetails) => ({
  //       ...prevDetails,
  //       videos: [...videos, ...uploadedVideos],
  //     }));
  //   },
  //   [videos, setProductDetails, disabled]
  // );

  // Select Primary Photo
  const handleSelectPrimary = useCallback(
    (index) => {
      if (disabled) return;
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        photoPrimaryIndex: index,
      }));
    },
    [setProductDetails, disabled]
  );

  // Delete Photo
  const handlePhotoDelete = useCallback(
    (index) => {
      if (disabled) return; // Vô hiệu hóa thao tác
      const updatedPhotos = photos.filter((_, photoIndex) => photoIndex !== index);
      const newPrimaryIndex = index < primaryIndex ? primaryIndex - 1 : primaryIndex;
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        photos: updatedPhotos,
        photoPrimaryIndex: updatedPhotos.length > 0 ? Math.min(newPrimaryIndex, updatedPhotos.length - 1) : 0,
      }));
    },
    [photos, primaryIndex, setProductDetails, disabled]
  );

  // const handleVideoDelete = useCallback(
  //   (index) => {
  //     if (disabled) return; // Vô hiệu hóa thao tác
  //     const updatedVideos = videos.filter((_, videoIndex) => videoIndex !== index);
  //     setProductDetails({ ...productDetails, videos: updatedVideos });
  //   },
  //   [videos, setProductDetails, productDetails, disabled]
  // );

  // Drag Handlers
  const handlePhotoDragOver = (event) => {
    if (disabled) return; // Vô hiệu hóa thao tác
    event.preventDefault();
  };

  const handlePhotoDrop = (event) => {
    if (disabled) return; // Vô hiệu hóa thao tác
    event.preventDefault();
    const uploadedPhotos = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
      setProductDetails((prevDetails) => ({
        ...prevDetails,
      photos: [...photos, ...uploadedPhotos],
    }));
  };

  // const handleVideoDragOver = (event) => {
  //   if (disabled) return; // Vô hiệu hóa thao tác
  //   event.preventDefault();
  // };

  // const handleVideoDrop = (event) => {
  //   if (disabled) return; // Vô hiệu hóa thao tác
  //   event.preventDefault();
  //   const uploadedVideos = Array.from(event.dataTransfer.files).filter((file) =>
  //     file.type.startsWith('video/')
  //   );
  //   setProductDetails((prevDetails) => ({
  //     ...prevDetails,
  //     videos: [...videos, ...uploadedVideos],
  //   }));
  // };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">PHOTOS</h2>
      <div className="flex space-x-4">
        {/* Photo Upload Area */}
        <div
          className={`w-full h-72 border border-dashed rounded-xl flex items-center justify-center flex-wrap gap-4 p-2 ${
            disabled ? 'opacity-50 pointer-events-none' : ''
          }`}
          onDragOver={handlePhotoDragOver}
          onDrop={handlePhotoDrop}
        >
          {photos.length === 0 ? (
            <label htmlFor="photo-upload" className="cursor-pointer text-center">
              <input
                type="file"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
                accept="image/*"
                disabled={disabled} // Disable input
              />
              <p className="text-gray-500">Add photos or drag and drop here</p>
            </label>
          ) : (
            <>
              {photos?.map((photo, index) => (
                <div
                  key={index}
                  className={`relative w-32 h-32 border rounded overflow-hidden ${
                    index === primaryIndex ? 'border-green-500 border-2' : ''
                  }`}
                >
                  <img
                    src={photo instanceof File ? URL.createObjectURL(photo) : typeof photo === "string" ? photo : null}
                    alt={`${index + 1}`}
                    onClick={() => !disabled && setPreviewPhoto(photo instanceof File ? URL.createObjectURL(photo) : photo)}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                  {!disabled && (
                    <>
                      {/* Delete Button */}
                      <button
                        onClick={() => handlePhotoDelete(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        &times;
                      </button>
                      {/* Select Primary Button */}
                      <button
                        onClick={() => handleSelectPrimary(index)}
                        // className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded"
                        className={primaryIndex === index ? 'absolute bottom-0 left-0 bg-green text-white text-xs px-1 rounded' : 'absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded'}
                      >
                        {index === primaryIndex ? 'Primary' : 'Set Primary'}
                      </button>
                    </>
                  )}
                </div>
              ))}
              {!disabled && (
                <label htmlFor="photo-upload" className="cursor-pointer w-20 h-20 border-dashed border flex items-center justify-center">
                  <input
                    type="file"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                    accept="image/*"
                  />
                  <span className="text-3xl text-gray-500">+</span>
                </label>
              )}
            </>
          )}
        </div>

        {/* Video Upload Area */}
        {/* <div
          className={`w-2/5 h-72 border border-dashed rounded-xl flex items-center justify-center flex-wrap gap-4 p-2 ${
            disabled ? 'opacity-50 pointer-events-none' : ''
          }`}
          onDragOver={handleVideoDragOver}
          onDrop={handleVideoDrop}
        >
          {videos.length === 0 ? (
            <label htmlFor="video-upload" className="cursor-pointer text-center">
              <input
                type="file"
                multiple
                onChange={handleVideoUpload}
                className="hidden"
                id="video-upload"
                accept="video/*"
                disabled={disabled} // Disable input
              />
              <p className="text-gray-500">Add videos or drag and drop here</p>
            </label>
          ) : (
            <>
              {videos.map((video, index) => (
                <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
                  <video
                    onClick={() => !disabled && setPreviewVideo(URL.createObjectURL(video))}
                    className="cursor-pointer object-cover w-full h-full"
                    src={URL.createObjectURL(video)}
                    controls={false}
                  />
                  {!disabled && (
                    <button
                      onClick={() => handleVideoDelete(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              {!disabled && (
                <label htmlFor="video-upload" className="cursor-pointer w-20 h-20 border-dashed border flex items-center justify-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                    accept="video/*"
                  />
                  <span className="text-3xl text-gray-500">+</span>
                </label>
              )}
            </>
          )}
        </div> */}
      </div>

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-0 rounded-lg shadow-lg max-w-4xl">
            <img src={previewPhoto} alt="Preview" className="max-w-full max-h-[800px] rounded-md" />
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 text-center"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {/* {previewVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-0 rounded-lg shadow-lg max-w-4xl">
            <video controls src={previewVideo} className="max-w-full max-h-[800px] rounded-md"></video>
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 text-center"
            >
              &times;
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
});
