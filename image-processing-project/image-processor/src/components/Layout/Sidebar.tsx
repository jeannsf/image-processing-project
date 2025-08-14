import React, { useState } from "react";
import {
  Palette,
  Shapes,
  Type,
  Star,
  Upload,
  Wrench,
  FolderOpen,
  Grid3X3,
  Wand2,
} from "lucide-react";
import { SidebarItemId, SidebarItems, SidebarProps } from "../../types";
import DesignPanel from "../DesignPanel/DesignPanel";

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const [isDesignPanelOpen, setIsDesignPanelOpen] = useState(false);

  const sidebarItems: SidebarItems[] = [
    { id: "design", icon: Palette, label: "Design" },
    { id: "elements", icon: Shapes, label: "Elementos" },
    { id: "text", icon: Type, label: "Texto" },
    { id: "brand", icon: Star, label: "Marca" },
    { id: "uploads", icon: Upload, label: "Uploads" },
    { id: "tools", icon: Wrench, label: "Ferramentas" },
    { id: "projects", icon: FolderOpen, label: "Projetos" },
    { id: "apps", icon: Grid3X3, label: "Apps" },
    { id: "magic", icon: Wand2, label: "Mídia Mágica" },
  ];

  const handleItemClick = (itemId: SidebarItemId) => {
    onItemClick?.(itemId);

    if (itemId === "design") {
      setIsDesignPanelOpen(true);
    }
  };

  const handleDesignPanelClose = () => {
    setIsDesignPanelOpen(false);
  };

  return (
    <>
      <div className="w-20 bg-white border-r border-gray-100 flex flex-col py-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                w-full h-16 flex flex-col items-center justify-center px-2 py-2 transition-all duration-150 group
                ${
                  isActive
                    ? "bg-blue-50 border-r-2 border-blue-500"
                    : "hover:bg-gray-50"
                }
              `}
              title={item.label}
            >
              <IconComponent
                size={18}
                className={`mb-1 ${
                  isActive ? "text-blue-600" : "text-gray-700"
                }`}
              />

              <span
                className={`
                text-xs font-normal leading-tight text-center max-w-full
                ${isActive ? "text-blue-600 font-medium" : "text-gray-700"}
              `}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <DesignPanel
        isOpen={isDesignPanelOpen}
        onClose={handleDesignPanelClose}
      />
    </>
  );
};

export default Sidebar;
