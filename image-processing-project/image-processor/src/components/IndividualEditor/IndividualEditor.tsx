import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import Button from "../ui/Button";
import { Background, ChromaImage, IndividualEditorProps, ProcessedImage } from "../../types";

const IndividualEditor: React.FC<IndividualEditorProps> = ({
  backgrounds,
  chromaImages,
  onClose,
  onImageExported,
}) => {
  const [selectedBackground, setSelectedBackground] =
    useState<Background | null>(null);
  const [selectedChroma, setSelectedChroma] = useState<ChromaImage | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!selectedBackground || !selectedChroma) {
      alert("Please select both a background and chroma image");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const processedImage: ProcessedImage = {
        id: `processed-${Date.now()}`,
        name: `processed-${selectedChroma.name}`,
        url: selectedChroma.url,
        originalChroma: selectedChroma.name,
        background: selectedBackground.name,
        createdAt: new Date(),
      };

      onImageExported?.(processedImage);
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Individual Editor
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Select Background
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {backgrounds.map((bg) => (
                <div
                  key={bg.id}
                  className={`
                    relative cursor-pointer rounded-lg overflow-hidden border-2 transition-colors
                    ${
                      selectedBackground?.id === bg.id
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                  onClick={() => setSelectedBackground(bg)}
                >
                  <div className="aspect-video bg-gray-100">
                    {bg.thumbnail || bg.url ? (
                      <img
                        src={bg.thumbnail || bg.url}
                        alt={bg.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate">{bg.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Select Chroma Image
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {chromaImages.map((chroma) => (
                <div
                  key={chroma.id}
                  className={`
                    relative cursor-pointer rounded-lg overflow-hidden border-2 transition-colors
                    ${
                      selectedChroma?.id === chroma.id
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                  onClick={() => setSelectedChroma(chroma)}
                >
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={chroma.url}
                      alt={chroma.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate">
                      {chroma.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedBackground && selectedChroma && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Preview
              </h3>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Background
                    </p>
                    <img
                      src={
                        selectedBackground.thumbnail || selectedBackground.url
                      }
                      alt="Background"
                      className="w-full aspect-video object-cover rounded"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Chroma
                    </p>
                    <img
                      src={selectedChroma.url}
                      alt="Chroma"
                      className="w-full aspect-video object-cover rounded"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Result Preview
                    </p>
                    <div className="w-full aspect-video bg-gray-200 rounded flex items-center justify-center">
                      <p className="text-sm text-gray-500">
                        Click process to see result
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleProcess}
            loading={isProcessing}
            disabled={!selectedBackground || !selectedChroma}
          >
            {isProcessing ? "Processing..." : "Process Image"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndividualEditor;
