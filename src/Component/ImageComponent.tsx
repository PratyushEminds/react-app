/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useRef, useState } from "react";

const ImageComponent: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newImages = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        );
        setImages((prevImages) => [...prevImages, ...newImages]);
        uploadToBackend(files); // Send the images to backend
      }
    },
    []
  );

  const uploadToBackend = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file); // Append each image to formData
    });

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log("Images uploaded successfully");
      } else {
        console.error("Failed to upload images");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Image Upload</h2>
      <div className="mb-4">
        <label
          htmlFor="image-upload"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Upload Images
        </label>
        <div className="flex items-center justify-center w-full">
          <input
            id="image-upload"
            type="file"
            className="hidden"
            onChange={handleImageUpload}
            multiple
            accept="image/*"
            ref={fileInputRef}
          />
        </div>
        <div className="mt-4">
          <button
            onClick={handleUploadClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Upload Images
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Uploaded image ${index + 1}`}
              className="w-full h-96 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
              <button
                onClick={() => setImages(images.filter((_, i) => i !== index))}
                className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                aria-label={`Delete image ${index + 1}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageComponent;
