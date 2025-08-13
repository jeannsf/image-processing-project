import React from 'react';
import { Download } from 'lucide-react';

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
        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
      >
        <Download size={16} />
        <span>Download</span>
      </button>
    </header>
  );
};

export default Header;
