import React, { useState, useEffect } from "react";
import Sidebar from "./components/SideBar/Sidebar";
import ChromaKeyPanel from "./components/ChromaList/ChromaKeyPanel";
import ResultPanel from "./components/ResultPanel/ResultPanel";
import ProcessButton from "./components/PorcessButton/ProcessButton";
import { Background, ChromaImage, ResultImage } from "./types";
import styles from "./App.module.css";
import {
  fetchBackgrounds,
  fetchChromas,
  fetchProcessedResults,
  processAndRefreshProcessedImages,
} from "./services/api";

const App: React.FC = () => {
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<Background[]>(
    []
  );
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [chromaImages, setChromaImages] = useState<ChromaImage[]>([]);
  const [results, setResults] = useState<ResultImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchBackgrounds()
      .then(setBackgrounds)
      .catch((error) => {
        console.error("Failed to fetch backgrounds:", error);
      });

    fetchChromas()
      .then(setChromaImages)
      .catch((error) => {
        console.error("Failed to fetch chromas:", error);
      });

    fetchProcessedResults()
      .then(setResults)
      .catch((error) => {
        console.error("Failed to fetch processed images:", error);
      });
  }, []);

  const handleProcess = async () => {
    if (chromaImages.length === 0) return;

    setIsProcessing(true);

    try {
      const chroma = chromaImages[0];
      if (!chroma.name) {
        throw new Error("Chroma image does not have a filename.");
      }

      const processedImages = await processAndRefreshProcessedImages(
        chroma.name
      );

      setResults(processedImages);
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.appContainer}>
      <Sidebar
        items={backgrounds}
        selected={selectedBackgrounds}
        onSelect={setSelectedBackgrounds}
      />

      <ChromaKeyPanel images={chromaImages} onChange={setChromaImages} />

      <ResultPanel results={results} loading={isProcessing} />

      <ProcessButton onClick={handleProcess} className={styles.processButton} />
    </div>
  );
};

export default App;
