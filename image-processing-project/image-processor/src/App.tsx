import React, { useState, useEffect } from "react";
import Sidebar from "./components/SideBar/Sidebar";
import ChromaKeyPanel from "./components/ChromaList/ChromaKeyPanel";
import ResultPanel from "./components/ResultPanel/ResultPanel";
import ProcessButton from "./components/PorcessButton/ProcessButton";
import IndividualEditor from "./components/IndividualEditor/IndividualEditor";
import { Background, ChromaImage, ResultImage } from "./types";
import styles from "./App.module.css";
import {
  fetchBackgrounds,
  fetchChromas,
  fetchProcessedResults,
  processAndRefreshProcessedImages,
} from "./services/api";

const App: React.FC = () => {
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null);
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [chromaImages, setChromaImages] = useState<ChromaImage[]>([]);
  const [results, setResults] = useState<ResultImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [isIndividualEditorOpen, setIsIndividualEditorOpen] = useState(false);

  useEffect(() => {
    fetchBackgrounds().then(setBackgrounds).catch(console.error);
    fetchChromas().then(setChromaImages).catch(console.error);
    fetchProcessedResults().then(setResults).catch(console.error);
  }, []);

  const handleProcess = async () => {
    setIsProcessing(true);
    try {
      const chroma = chromaImages[0]; 
      if (!chroma.name) {
        throw new Error("A imagem de chroma não possui um nome de arquivo.");
      }

      const processedImages = await processAndRefreshProcessedImages(chroma.name);
      setResults(processedImages);
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      alert("Ocorreu um erro durante o processamento.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenIndividualEditor = () => {
    setIsIndividualEditorOpen(true);
  };

  const handleCloseIndividualEditor = () => {
    setIsIndividualEditorOpen(false);
  };

  return (
    <>
      <div className={styles.appContainer}>
        <Sidebar
          items={backgrounds}
          selected={selectedBackground ? [selectedBackground] : []}
          onSelect={setSelectedBackground}
        />

        <ChromaKeyPanel images={chromaImages} onChange={setChromaImages} />

        <div className={styles.resultsPanel}>
          <ResultPanel results={results} loading={isProcessing} onChange={setResults} />
        </div>
      </div>

      <div className={styles.actionBar}>
        <button
          className={styles.individualEditorButton}
          onClick={handleOpenIndividualEditor}
        >
          Editor Individual
        </button>
        
        <ProcessButton
          onClick={handleProcess}
          className={styles.processButton}
        >
          {isProcessing ? "Processando..." : "Gerar Resultado"}
        </ProcessButton>
      </div>

      {isIndividualEditorOpen && (
        <IndividualEditor
          backgrounds={backgrounds}
          chromaImages={chromaImages}
          onClose={handleCloseIndividualEditor}
        />
      )}
    </>
  );
};

export default App;