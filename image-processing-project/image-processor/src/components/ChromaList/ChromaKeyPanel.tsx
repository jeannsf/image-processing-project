import React from "react";
import { useDropzone } from "react-dropzone";
import styles from "./ChromaKeyPanel.module.css";
import { ChromaImage } from "../../types";
import { uploadAndRefreshChromas, deleteImage } from "../../services/api";

interface ChromaKeyPanelProps {
  images: ChromaImage[];
  onChange: (imgs: ChromaImage[]) => void;
}

const ChromaKeyPanel: React.FC<ChromaKeyPanelProps> = ({ images, onChange }) => {
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      for (const file of acceptedFiles) {
        const updatedList = await uploadAndRefreshChromas(file);
        onChange(updatedList);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const handleRemove = async (img: ChromaImage) => {
    try {
      if (!img.name) {
        console.warn("Image name missing, cannot delete");
        return;
      }
      const updatedList = await deleteImage(img.name, "chroma");
      onChange(updatedList as ChromaImage[]);
    } catch (error) {
      console.error("Failed to delete chroma image:", error);
    }
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Chroma Key</h2>

      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${
          isDragActive ? styles.dropzoneActive : ""
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive
          ? "Solte as imagens aqui"
          : "Arraste imagens ou clique para selecionar"}
      </div>

      {images.length > 0 && (
        <div className={styles.previewList}>
          {images.map((img) => (
            <div key={img.id} className={styles.previewItem}>
              <img
                src={img.previewUrl}
                alt="Preview chroma"
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={() => handleRemove(img)}
                className={styles.removeButton}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChromaKeyPanel;
