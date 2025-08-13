import React from 'react';
import { Download, Eye, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { Result, ResultPanelProps } from '../../types';


const ResultPanel: React.FC<ResultPanelProps> = ({ results, loading, onChange }) => {
  const handleDownload = (result: Result) => {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (resultId: string) => {
    const updatedResults = results.filter(result => result.id !== resultId);
    onChange(updatedResults);
  };

  const handlePreview = (result: Result) => {
    window.open(result.url, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Processing Results</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Processing images...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Processing Results</h2>
      
      {results.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">No processed images yet</p>
          <p className="text-xs text-gray-500 mt-1">Upload chroma images and click process to see results</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result) => (
            <div key={result.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img 
                  src={result.url} 
                  alt={result.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate mb-2">
                  {result.name}
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(result)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDownload(result)}
                    className="flex-1"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(result.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultPanel;
