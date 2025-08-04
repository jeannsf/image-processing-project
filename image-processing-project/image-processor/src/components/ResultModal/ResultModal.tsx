import React, { useState } from "react";
import { ResultImage } from "../../types";
import styles from "./ResultModal.module.css";
import { downloadImageWithFilter } from "../../utils/download"; // Import da nova função

interface ResultModalProps {
  image: ResultImage;
  onClose: () => void;
}

type FilterOption = {
  label: string;
  value: string;
};

const filterOptions: FilterOption[] = [
  { label: "Sem filtro", value: "none" },
  { label: "Preto e Branco", value: "grayscale(1)" },
  { label: "Sépia", value: "sepia(1)" },
  { label: "Alto Contraste", value: "contrast(1.5)" },
  { label: "Desfocado", value: "blur(2px)" },
  { label: "Invertido", value: "invert(1)" },
  { label: "Baixa Opacidade", value: "opacity(0.5)" },
  { label: "Brilho Extra", value: "brightness(1.3)" },
];

const ResultModal: React.FC<ResultModalProps> = ({ image, onClose }) => {
  const [brightness, setBrightness] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("none");

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightness(parseFloat(e.target.value));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
  };

  const computedStyle = {
    filter: `${selectedFilter !== "none" ? selectedFilter : ""} brightness(${brightness})`,
  };

  const handleDownload = async () => {
    try {
      const filter = `${selectedFilter !== "none" ? selectedFilter : ""} brightness(${brightness})`;
      await downloadImageWithFilter(image.url, `imagem-filtrada-${image.id}.png`, filter);
    } catch (error) {
      console.error("Erro ao baixar imagem com filtro:", error);
      alert("Falha ao baixar a imagem. Verifique o CORS do servidor de origem.");
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <img
          src={image.url}
          alt="Resultado"
          className={styles.preview}
          style={computedStyle}
          crossOrigin="anonymous"
        />

        <div className={styles.controls}>
          <label>
            Ajustar brilho:
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.01"
              value={brightness}
              onChange={handleBrightnessChange}
            />
          </label>

          <label>
            Filtro:
            <select
              className={styles.dropdown}
              value={selectedFilter}
              onChange={handleFilterChange}
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose}>Fechar</button>
          <button onClick={handleDownload}>Baixar</button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
