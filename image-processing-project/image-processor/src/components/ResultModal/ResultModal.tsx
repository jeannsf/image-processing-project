import React, { useState } from "react";
import { ResultImage } from "../../types";
import styles from "./ResultModal.module.css";
import { downloadImageWithFilter } from "../../utils/download";

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
  { label: "Vintage", value: "sepia(0.7) contrast(1.1) brightness(0.9)" },
  { label: "Tons Frios", value: "hue-rotate(180deg)" },
  { label: "Futurista", value: "hue-rotate(90deg) saturate(2.5)" },
];

const ResultModal: React.FC<ResultModalProps> = ({ image, onClose }) => {
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [hueRotate, setHueRotate] = useState(0);
  const [blur, setBlur] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("none");

  const computedStyle = {
    filter: `
      ${selectedFilter !== "none" ? selectedFilter : ""}
      brightness(${brightness})
      contrast(${contrast})
      saturate(${saturation})
      hue-rotate(${hueRotate}deg)
      blur(${blur}px)
    `.trim(),
  };

  const handleDownload = async () => {
    try {
      const filterValue = computedStyle.filter.replace(/\s+/g, " ").trim();
      await downloadImageWithFilter(image.url, `imagem-filtrada-${image.id}.png`, filterValue);
    } catch (error) {
      console.error("Erro ao baixar imagem com filtro:", error);
      alert("Falha ao baixar a imagem. Verifique o CORS do servidor de origem.");
    }
  };

  const handleReset = () => {
    setBrightness(1);
    setContrast(1);
    setSaturation(1);
    setHueRotate(0);
    setBlur(0);
    setSelectedFilter("none");
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
          <select
            className={styles.dropdown}
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label>
            Brilho
            <input type="range" min="0.5" max="1.5" step="0.01" value={brightness} onChange={(e) => setBrightness(parseFloat(e.target.value))} />
          </label>
          <label>
            Contraste
            <input type="range" min="0.5" max="2" step="0.1" value={contrast} onChange={(e) => setContrast(parseFloat(e.target.value))} />
          </label>
          <label>
            Saturação
            <input type="range" min="0" max="3" step="0.1" value={saturation} onChange={(e) => setSaturation(parseFloat(e.target.value))} />
          </label>
          <label>
            Tonalidade
            <input type="range" min="-180" max="180" step="1" value={hueRotate} onChange={(e) => setHueRotate(parseFloat(e.target.value))} />
          </label>
          <label>
            Desfoque
            <input type="range" min="0" max="10" step="0.5" value={blur} onChange={(e) => setBlur(parseFloat(e.target.value))} />
          </label>
        </div>

        <div className={styles.actions}>
          <button onClick={handleReset} className={styles.secondaryButton}>Resetar</button>
          <button onClick={onClose} className={styles.secondaryButton}>Fechar</button>
          <button onClick={handleDownload} className={styles.primaryButton}>Baixar Imagem</button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
