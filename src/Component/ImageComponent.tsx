/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useRef, useState } from "react";

const ImageComponent:React.FC = () => {
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newImages = Array.from(files).map(file => URL.createObjectURL(file));
        setImages(prevImages => [...prevImages, ...newImages]);
      }
    }, []);
  
    const handleUploadClick = () => {
      fileInputRef.current?.click();
    };
  
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Image Upload</h2>
        <div className="mb-4">
          <label htmlFor="image-upload" className="block mb-2 text-sm font-medium text-gray-900">
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
              <img src={image} alt={`Uploaded image ${index + 1}`} className="w-full h-96 object-cover rounded-lg" />
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
