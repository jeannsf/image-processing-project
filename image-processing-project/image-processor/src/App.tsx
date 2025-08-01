import React, { useState } from "react";
import Sidebar from "./components/SideBar/Sidebar";
import ChromaKeyPanel from "./components/ChromaList/ChromaKeyPanel";
import ResultPanel from "./components/ResultPanel/ResultPanel";
import ProcessButton from "./components/PorcessButton/ProcessButton";
import { Background, ChromaImage, ResultImage } from "./types";
import styles from "./App.module.css";

const dummyBackgrounds: Background[] = [
  { id: "b1", name: "Praia", url: "https://picsum.photos/id/1015/600/400" },
  { id: "b2", name: "Montanha", url: "https://picsum.photos/id/1003/600/400" },
  {
    id: "b3",
    name: "Cidade à Noite",
    url: "https://picsum.photos/id/1011/600/400",
  },
  { id: "b4", name: "Floresta", url: "https://picsum.photos/id/1024/600/400" },
];

const App: React.FC = () => {
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<Background[]>([]);
  const [chromaImages, setChromaImages] = useState<ChromaImage[]>([]);
  const [results, setResults] = useState<ResultImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {
    if (selectedBackgrounds.length === 0 || chromaImages.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const simulated: ResultImage[] = chromaImages.map((img, idx) => ({
        id: `${img.id}-r`,
        url: `https://picsum.photos/seed/result-${idx}/300/200`,
      }));
      setResults(simulated);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className={styles.appContainer}>
      <Sidebar
        items={dummyBackgrounds}
        selected={selectedBackgrounds}
        onSelect={setSelectedBackgrounds}
      />

      <ChromaKeyPanel images={chromaImages} onChange={setChromaImages} />

      <ResultPanel results={results} loading={isProcessing} />

      <ProcessButton
        disabled={
          selectedBackgrounds.length === 0 ||
          chromaImages.length === 0 ||
          isProcessing
        }
        onClick={handleProcess}
        className={styles.processButton}
      />
    </div>
  );
};

export default App;
