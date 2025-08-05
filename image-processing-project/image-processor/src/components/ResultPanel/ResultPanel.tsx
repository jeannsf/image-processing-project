import React, { useState } from "react";
import { ResultImage } from "../../types";
import { downloadImage } from "../../utils/download";
import { Download, Trash2 } from "lucide-react";
import { deleteImage } from "../../services/api";
import ResultModal from "../ResultModal/ResultModal";
import styles from "./ResultPanel.module.css";

interface ResultPanelProps {
  results: ResultImage[];
  loading: boolean;
  onChange: (results: ResultImage[]) => void;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ results, loading, onChange }) => {
  const [selectedImage, setSelectedImage] = useState<ResultImage | null>(null);

  const handleDelete = async (e: React.MouseEvent, img: ResultImage) => {
    e.stopPropagation(); 
    if (!img.name) {
      console.warn("Image name missing, cannot delete");
      return;
    }
    try {
      const updatedResults = await deleteImage(img.name, "processed");
      onChange(updatedResults as ResultImage[]);
    } catch (error) {
      console.error("Failed to delete processed image:", error);
    }
  };

  const handleDownload = (e: React.MouseEvent, img: ResultImage) => {
    e.stopPropagation(); 
    downloadImage(img.url, `resultado-${img.id}.png`);
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Resultados</h2>

      {loading && (
        <div className={styles.overlay}>
          <div className={styles.spinner} />
          <span>Processando...</span>
        </div>
      )}

      <div className={styles.grid}>
        {results.map((res) => (
          <div
            key={res.id}
            className={styles.imageCard}
            onClick={() => setSelectedImage(res)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(res)}
          >
            <img src={res.url} alt={`Resultado ${res.id}`} className={styles.image} />

            <div className={styles.actionsOverlay}>
              <Download
                className={`${styles.icon} ${styles.downloadIcon}`}
                size={20}
                onClick={(e) => handleDownload(e, res)}
              />
              <Trash2
                className={`${styles.icon} ${styles.deleteIcon}`}
                size={20}
                onClick={(e) => handleDelete(e, res)}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ResultModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ResultPanel;
