import React, { useCallback, useRef, useState } from "react";

const ImageComponent: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // For input images
  const [backendImages, setBackendImages] = useState<
    { base64_image: string; attached_string: string }[]
  >([]); // Initialize as an empty array
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newImages = Array.from(files).map((file) =>
          URL.createObjectURL(file)
        );
        setUploadedImages((prevImages) => [...prevImages, ...newImages]);
        uploadToBackend(files);
      }
    },
    []
  );

  const uploadToBackend = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:8000/upload_and_detect", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setBackendImages(data);
      } else {
        setBackendImages([data]);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  // const uploadToBackend = async (files: FileList) => {
  //   const formData = new FormData();
  //   Array.from(files).forEach((file) => {
  //     formData.append("files", file);
  //   });

  //   try {
  //     const response = await fetch("http://localhost:8000/upload_with_base64", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const data = await response.json();

  //     // Ensure data is an array
  //     if (Array.isArray(data)) {
  //       setBackendImages(data);
  //     } else {
  //       setBackendImages([data]); // In case the backend sends a single object, wrap it in an array
  //     }
  //   } catch (error) {
  //     console.error("Error uploading images:", error);
  //   }
  // };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Upload</h2>
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

      <h3 className="text-xl font-bold mb-2">Uploaded Images</h3>
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2">
        {uploadedImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Uploaded image ${index + 1}`}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      <h3 className="text-xl font-bold mt-6 mb-2">Processed Images</h3>
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2">
        {backendImages.map((imageData, index) => (
          <div key={index} className="relative group">
            <img
              src={`data:image/png;base64,${imageData.base64_image}`}
              alt={`Backend processed image ${index + 1}`}
              className="w-full h-96 object-cover rounded-lg"
            />
            <p className="mt-2 text-sm">{imageData.attached_string}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageComponent;
