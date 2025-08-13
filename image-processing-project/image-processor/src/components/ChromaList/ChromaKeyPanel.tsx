import React, { useRef, ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Button from '../ui/Button';
import { ChromaImage, ChromaKeyPanelProps } from "../../types";



const ChromaKeyPanel: React.FC<ChromaKeyPanelProps> = ({
  images,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const newImages: ChromaImage[] = files.map((file, index) => ({
      id: `chroma-${Date.now()}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
    }));

    onChange([...images, ...newImages]);
  };

  const handleRemoveImage = (imageId: string) => {
    const updatedImages = images.filter((img) => img.id !== imageId);
    onChange(updatedImages);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Chroma Key Images
      </h2>

      <div className="space-y-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={handleUploadClick}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {images.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Uploaded Images
            </h3>
            {images.map((image) => (
              <div
                key={image.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.name}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveImage(image.id)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUploadClick}
            className="w-full"
          >
            Add More Images
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChromaKeyPanel;
