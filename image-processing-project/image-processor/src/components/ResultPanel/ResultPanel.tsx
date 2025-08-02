import React from "react";
import { ResultImage } from "../../types";
import { downloadImage } from "../../utils/download";
import { Download, Trash2 } from "lucide-react";
import { deleteImage } from "../../services/api";

import styles from "./ResultPanel.module.css";

interface ResultPanelProps {
  results: ResultImage[];
  loading: boolean;
  onChange: (results: ResultImage[]) => void;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ results, loading, onChange }) => {
  const handleDelete = async (img: ResultImage) => {
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

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Resultados</h2>

      {loading && (
        <div className={styles.overlay}>
          <div className={styles.spinner} />
          Processando...
        </div>
      )}

      <div className={styles.grid}>
        {results.map((res) => (
          <div key={res.id} className={styles.item}>
            <div className={styles.imageWrapper}>
              <img src={res.url} alt="Resultado" className={styles.image} />

              <Download
                className={`${styles.downloadIcon} ${styles.leftIcon}`}
                size={15}
                onClick={() => downloadImage(res.url, `resultado-${res.id}.png`)}
              />

              <Trash2
                className={`${styles.downloadIcon} ${styles.rightIcon}`}
                size={15}
                onClick={() => handleDelete(res)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultPanel;
