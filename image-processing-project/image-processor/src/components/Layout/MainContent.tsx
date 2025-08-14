import React, { ReactNode } from 'react';

interface MainContentProps {
  children?: ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto p-8 flex items-center justify-center">
        {children || (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-[1280px] h-[720px] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 tracking-wider">
                PASS
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;
