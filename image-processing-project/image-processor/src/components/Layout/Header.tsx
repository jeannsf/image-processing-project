import React from "react";
import { Download } from "lucide-react";

interface HeaderProps {
  onDownload: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDownload }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-slate-800 text-white border-b border-slate-700">
      <div className="flex items-center space-x-2 text-sm text-slate-300">
        <span></span>
        <span></span>
        <span className="text-white">Pass</span>
      </div>

      <button
        onClick={onDownload}
        className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="tabler-icon"
        >
          <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"></path>
          <path d="M9 15l3 -3l3 3"></path>
          <path d="M12 12l0 9"></path>
        </svg>
        <span>Export</span>
      </button>
    </header>
  );
};

export default Header;
