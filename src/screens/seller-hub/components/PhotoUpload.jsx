import React, { useState, useCallback, memo, useMemo } from 'react';

// Component PhotoUpload được memo hóa để tránh re-render không cần thiết
export const PhotoUpload = memo(({ productDetails, setProductDetails }) => {
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);

  // Sử dụng useMemo để ghi nhớ giá trị của photos và videos
  const photos = useMemo(() => productDetails.photos || [], [productDetails.photos]);
  const videos = useMemo(() => productDetails.videos || [], [productDetails.videos]);

  // Photo Upload Handlers
  const handlePhotoUpload = useCallback(
    (event) => {
      const uploadedPhotos = Array.from(event.target.files);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        photos: [...photos, ...uploadedPhotos],
      }));
    },
    [photos, setProductDetails]
  );

  // Video Upload Handlers
  const handleVideoUpload = useCallback(
    (event) => {
      const uploadedVideos = Array.from(event.target.files);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        videos: [...videos, ...uploadedVideos],
      }));
    },
    [videos, setProductDetails]
  );

  // Delete Handlers
  const handlePhotoDelete = useCallback(
    (index) => {
      const updatedPhotos = photos.filter((_, photoIndex) => photoIndex !== index);
      setProductDetails({ ...productDetails, photos: updatedPhotos });
    },
    [photos, setProductDetails, productDetails]
  );

  const handleVideoDelete = useCallback(
    (index) => {
      const updatedVideos = videos.filter((_, videoIndex) => videoIndex !== index);
      setProductDetails({ ...productDetails, videos: updatedVideos });
    },
    [videos, setProductDetails, productDetails]
  );

  // Drag Handlers
  const handlePhotoDragOver = (event) => {
    event.preventDefault();
  };

  const handlePhotoDrop = (event) => {
    event.preventDefault();
    const uploadedPhotos = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      photos: [...photos, ...uploadedPhotos],
    }));
  };

  const handleVideoDragOver = (event) => {
    event.preventDefault();
  };

  const handleVideoDrop = (event) => {
    event.preventDefault();
    const uploadedVideos = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('video/')
    );
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      videos: [...videos, ...uploadedVideos],
    }));
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">PHOTO & VIDEO</h2>
      <div className="flex space-x-4">
        {/* Photo Upload Area */}
        <div
          className="w-3/5 h-72 border border-dashed rounded-xl flex items-center justify-center flex-wrap gap-4 p-2"
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
              />
              <p className="text-gray-500">Add photos or drag and drop here</p>
            </label>
          ) : (
            <>
              {photos.map((photo, index) => (
                <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`${index + 1}`}
                    onClick={() => setPreviewPhoto(URL.createObjectURL(photo))}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                  <button
                    onClick={() => handlePhotoDelete(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
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
            </>
          )}
        </div>

        {/* Video Upload Area */}
        <div
          className="w-2/5 h-72 border border-dashed rounded-xl flex items-center justify-center flex-wrap gap-4 p-2"
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
              />
              <p className="text-gray-500">Add videos or drag and drop here</p>
            </label>
          ) : (
            <>
              {videos.map((video, index) => (
                <div key={index} className="relative w-20 h-20 border rounded overflow-hidden">
                  <video
                    onClick={() => setPreviewVideo(URL.createObjectURL(video))}
                    className="cursor-pointer object-cover w-full h-full"
                    src={URL.createObjectURL(video)}
                    controls={false}
                  />
                  <button
                    onClick={() => handleVideoDelete(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
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
            </>
          )}
        </div>
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
      {previewVideo && (
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
      )}
    </div>
  );
});
