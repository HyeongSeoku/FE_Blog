"use client";

import { useState, DragEvent, ChangeEvent } from "react";

const ImageUpload = () => {
  const [images, setImages] = useState<string[]>([]);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const fileReaders: FileReader[] = [];
    const fileData: string[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onload = (e) => {
        if (e.target?.result) {
          fileData.push(e.target.result as string);
          if (fileData.length === files.length) {
            setImages((prevImages) => [...prevImages, ...fileData]);
          }
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    handleFiles(files);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        multiple
        onChange={handleInputChange}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer text-blue-500 hover:underline"
      >
        Drag and drop images here or click to select files
      </label>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Uploaded ${index}`}
            className="w-24 h-24 object-cover"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
