import React, { useState, useRef, useEffect } from "react";
import { Background, ChromaImage } from "../../types";
import styles from "./IndividualEditor.module.css";
import { removeBackground } from "@imgly/background-removal";

interface IndividualEditorProps {
  backgrounds: Background[];
  chromaImages: ChromaImage[];
  onClose: () => void;
}

interface ChromaStyles {
  scale: number;
  positionX: number;
  positionY: number;
  rotation: number;
  opacity: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
}

const defaultStyles: ChromaStyles = {
  scale: 100,
  positionX: 50,
  positionY: 50,
  rotation: 0,
  opacity: 100,
  flipHorizontal: false,
  flipVertical: false,
};

const IndividualEditor: React.FC<IndividualEditorProps> = ({
  backgrounds,
  chromaImages,
  onClose,
}) => {
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null);
  const [selectedChroma, setSelectedChroma] = useState<ChromaImage | null>(null);
  const [chromaStyles, setChromaStyles] = useState<ChromaStyles>(defaultStyles);
  const [processedChromaImages, setProcessedChromaImages] = useState<ChromaImage[]>([]);
  const [isProcessingGrid, setIsProcessingGrid] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const handleStyleChange = (property: keyof ChromaStyles, value: any) => {
    setChromaStyles(prev => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleReset = () => {
    setChromaStyles(defaultStyles);
  };

  const handleExport = () => {
    // Aqui seria implementada a lógica de exportação/download da imagem composta
    // Por enquanto, apenas mostra um alert
    alert("Funcionalidade de exportação será implementada!");
  };

  const processChromaImage = async (chromaImage: ChromaImage): Promise<ChromaImage> => {
    try {
      const imageUrl = chromaImage.previewUrl || chromaImage.url;
      if (!imageUrl) return chromaImage;

      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const blob = await removeBackground(imageUrl);
      
      const processedUrl = URL.createObjectURL(blob);
      
      return {
        ...chromaImage,
        processedUrl
      };
      
    } catch (error) {
      console.error(`Erro ao processar imagem ${chromaImage.name}:`, error);
      return chromaImage; 
    }
  };

  useEffect(() => {
    const processAllChromaImages = async () => {
      if (chromaImages.length === 0) return;

      setIsProcessingGrid(true);
      setProcessedCount(0);
      
      const processed: ChromaImage[] = [];
      
      for (let i = 0; i < chromaImages.length; i++) {
        const processedImage = await processChromaImage(chromaImages[i]);
        processed.push(processedImage);
        setProcessedCount(i + 1);
      }
      
      setProcessedChromaImages(processed);
      setIsProcessingGrid(false);
    };

    processAllChromaImages();

    return () => {
      processedChromaImages.forEach(img => {
        if (img.processedUrl && img.processedUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.processedUrl);
        }
      });
    };
  }, [chromaImages]);

  const getChromaPreviewStyle = () => {
    return {
      transform: `
        translate(${chromaStyles.positionX - 50}%, ${chromaStyles.positionY - 50}%)
        scale(${chromaStyles.scale / 100})
        rotate(${chromaStyles.rotation}deg)
        scaleX(${chromaStyles.flipHorizontal ? -1 : 1})
        scaleY(${chromaStyles.flipVertical ? -1 : 1})
      `,
      opacity: chromaStyles.opacity / 100,
    };
  };

  const getImageUrlForGrid = (chroma: ChromaImage) => {
    if (isProcessingGrid) {
      return chroma.previewUrl || chroma.url || "/placeholder-image.png";
    }
    
    const processedImage = processedChromaImages.find(img => img.id === chroma.id);
    return processedImage?.processedUrl || chroma.previewUrl || chroma.url || "/placeholder-image.png";
  };

  const getImageUrlForPreview = () => {
    if (!selectedChroma) return null;
    
    const processedImage = processedChromaImages.find(img => img.id === selectedChroma.id);
    return processedImage?.processedUrl || selectedChroma.previewUrl || selectedChroma.url || "/placeholder-image.png";
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.header}>
        <h2>Editor Individual</h2>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.selectionPanel}>
          <h3>Selecionar Background</h3>
          <div className={styles.imageGrid}>
            {backgrounds.map((bg) => (
              <div
                key={bg.id}
                className={`${styles.imageItem} ${
                  selectedBackground?.id === bg.id ? styles.selected : ""
                }`}
                onClick={() => setSelectedBackground(bg)}
              >
                <img src={bg.thumbnail || bg.url} alt={bg.name} />
                <span>{bg.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.selectionPanel}>
          <h3>Selecionar Imagem Chroma</h3>
          
          {isProcessingGrid && (
            <div className={styles.gridProcessingIndicator}>
              Processando imagens... ({processedCount}/{chromaImages.length})
            </div>
          )}
          
          <div className={styles.imageGrid}>
            {chromaImages.map((chroma) => (
              <div
                key={chroma.id}
                className={`${styles.imageItem} ${
                  selectedChroma?.id === chroma.id ? styles.selected : ""
                } ${isProcessingGrid ? styles.processing : ""}`}
                onClick={() => setSelectedChroma(chroma)}
              >
                <img 
                  src={getImageUrlForGrid(chroma)} 
                  alt={chroma.name} 
                  className={styles.chromaGridImage}
                />
                <span>{chroma.name}</span>
                {isProcessingGrid && (
                  <div className={styles.imageProcessingOverlay}>
                    <div className={styles.spinner}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedBackground && selectedChroma && (
          <div className={styles.editorPanel}>
            <div className={styles.previewSection}>
              <h3>Pré-visualização</h3>
              <div className={styles.previewContainer}>
                <img
                  src={selectedBackground.url}
                  alt="Background"
                  className={styles.backgroundImage}
                />
                {getImageUrlForPreview() && (
                  <img
                    src={getImageUrlForPreview()!}
                    alt="Chroma sem fundo"
                    className={styles.chromaImage}
                    style={getChromaPreviewStyle()}
                  />
                )}
              </div>
            </div>

            <div className={styles.controlsSection}>
              <h3>Controles de Estilização</h3>
              
              <div className={styles.controls}>
                <label>
                  Tamanho: {chromaStyles.scale}%
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={chromaStyles.scale}
                    onChange={(e) => handleStyleChange("scale", parseInt(e.target.value))}
                  />
                </label>

                <label>
                  Posição X: {chromaStyles.positionX}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={chromaStyles.positionX}
                    onChange={(e) => handleStyleChange("positionX", parseInt(e.target.value))}
                  />
                </label>

                <label>
                  Posição Y: {chromaStyles.positionY}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={chromaStyles.positionY}
                    onChange={(e) => handleStyleChange("positionY", parseInt(e.target.value))}
                  />
                </label>

                <label>
                  Rotação: {chromaStyles.rotation}°
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={chromaStyles.rotation}
                    onChange={(e) => handleStyleChange("rotation", parseInt(e.target.value))}
                  />
                </label>

                <label>
                  Opacidade: {chromaStyles.opacity}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={chromaStyles.opacity}
                    onChange={(e) => handleStyleChange("opacity", parseInt(e.target.value))}
                  />
                </label>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={chromaStyles.flipHorizontal}
                      onChange={(e) => handleStyleChange("flipHorizontal", e.target.checked)}
                    />
                    Espelhar Horizontalmente
                  </label>

                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={chromaStyles.flipVertical}
                      onChange={(e) => handleStyleChange("flipVertical", e.target.checked)}
                    />
                    Espelhar Verticalmente
                  </label>
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.resetButton} onClick={handleReset}>
                  Resetar
                </button>
                <button className={styles.exportButton} onClick={handleExport}>
                  Exportar Imagem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualEditor;