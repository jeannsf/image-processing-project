import React, { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import MainContent from "./components/Layout/MainContent";

import ChromaKeyPanel from "./components/ChromaList/ChromaKeyPanel";
import ResultPanel from "./components/ResultPanel/ResultPanel";
import IndividualEditor from "./components/IndividualEditor/IndividualEditor";

import {
  fetchBackgrounds,
  fetchChromas,
  fetchProcessedResults,
  processAndRefreshProcessedImages,
} from "./services/api";

import {
  Background,
  BackgroundImage,
  ChromaImage,
  ProcessedImage,
  Result,
  SidebarItemId,
} from "./types";

const App: React.FC = () => {
  const [selectedBackground, setSelectedBackground] =
    useState<BackgroundImage | null>(null);
  const [backgrounds, setBackgrounds] = useState<BackgroundImage[]>([]);
  const [chromaImages, setChromaImages] = useState<ChromaImage[]>([]);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isIndividualEditorOpen, setIsIndividualEditorOpen] =
    useState<boolean>(false);

  const [activeSidebarItem, setActiveSidebarItem] =
    useState<SidebarItemId>("refresh");
  const [currentView, setCurrentView] = useState<string>("main");

  useEffect(() => {
    fetchBackgrounds()
      .then((backgrounds: Background[]) => {
        const backgroundsWithUrl: BackgroundImage[] = backgrounds
          .filter((bg) => !!bg.url)
          .map((bg) => ({
            id: bg.id,
            name: bg.name,
            url: bg.url!,
            thumbnail: bg.thumbnail ?? bg.url!,
          }));
        setBackgrounds(backgroundsWithUrl);
      })
      .catch(console.error);

    fetchChromas().then(setChromaImages).catch(console.error);

    fetchProcessedResults()
      .then((fetchedResults) => {
        const processedResults = fetchedResults.map((item) => ({
          ...item,
          thumbnail: (item as any).thumbnail ?? item.url,
        }));
        setResults(processedResults);
      })
      .catch(console.error);
  }, []);

  const handleProcess = async () => {
    if (chromaImages.length === 0) {
      alert("Please upload at least one chroma image");
      return;
    }

    setIsProcessing(true);
    try {
      const chroma = chromaImages[0];
      if (!chroma.name) {
        throw new Error("A imagem de chroma não possui um nome de arquivo.");
      }

      const processedImagesRaw: ProcessedImage[] =
        await processAndRefreshProcessedImages(chroma.name);

      const processedImages: ProcessedImage[] = processedImagesRaw.map(
        (item) => ({
          ...item,
          thumbnail: item.thumbnail ?? item.url,
        })
      );

      setResults(processedImages);
      setCurrentView("results");
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

  const refreshResults = async () => {
    try {
      const updatedResults = await fetchProcessedResults();
      const processedResults = updatedResults.map((item) => ({
        ...item,
        thumbnail: (item as any).thumbnail ?? item.url,
      }));
      setResults(processedResults);
    } catch (error) {
      console.error("Erro ao atualizar resultados:", error);
    }
  };

  const handleResultsChange = (newResults: Result[]) => {
    const processedImages: ProcessedImage[] = newResults.map((r) => ({
      ...r,
      originalChroma: null, 
      background: "",
      createdAt: new Date(),
      thumbnail: (r as any).thumbnail ?? r.url,
    }));
    setResults(processedImages);
  };

  const handleSidebarItemClick = (itemId: SidebarItemId) => {
    setActiveSidebarItem(itemId);

    switch (itemId) {
      case "refresh":
        setCurrentView("main");
        break;
      case "resize":
        setCurrentView("chroma");
        break;
      case "favorite":
        setCurrentView("results");
        break;
      case "text":
        handleOpenIndividualEditor();
        break;
      default:
        setCurrentView("main");
    }
  };

  const handleDownload = () => {
    if (results.length > 0) {
      const link = document.createElement("a");
      link.href = results[0].url;
      link.download = results[0].name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No processed images available for download");
    }
  };

  const renderMainContent = () => {
    switch (currentView) {
      case "chroma":
        return (
          <div className="max-w-2xl mx-auto">
            <ChromaKeyPanel images={chromaImages} onChange={setChromaImages} />
          </div>
        );
      case "results":
        return (
          <div className="max-w-6xl mx-auto">
            <ResultPanel
              results={results}
              loading={isProcessing}
              onChange={handleResultsChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onDownload={handleDownload} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeItem={activeSidebarItem}
          onItemClick={handleSidebarItemClick}
        />

        <MainContent>{renderMainContent()}</MainContent>
      </div>

      {isIndividualEditorOpen && (
        <IndividualEditor
          backgrounds={backgrounds}
          chromaImages={chromaImages}
          onClose={handleCloseIndividualEditor}
          onImageExported={refreshResults}
        />
      )}
    </div>
  );
};

export default App;
