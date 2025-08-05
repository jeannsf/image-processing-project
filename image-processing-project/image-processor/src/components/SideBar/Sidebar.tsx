import React from 'react';
import { Background } from '../../types';
import styles from './SideBar.module.css';

interface SidebarProps {
  items: Background[];
  selected: Background[]; // Mantido para lógica de seleção
  onSelect: (bg: Background) => void; // Alterado para selecionar um item de cada vez
}

const Sidebar: React.FC<SidebarProps> = ({ items, selected, onSelect }) => {
  // Função para verificar se um item está selecionado
  const isSelected = (bg: Background) => {
    return selected.some(selectedBg => selectedBg.id === bg.id);
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Planos de Fundo</h2>
      
      <div className={styles.panelScrollable}>
        {/* Usando a nova classe de grid */}
        <div className={styles.grid}>
          {items.map((bg) => (
            <div
              key={bg.id}
              // Combina a classe base com a classe de seleção condicionalmente
              className={`${styles.card} ${isSelected(bg) ? styles.cardSelected : ''}`}
              onClick={() => onSelect(bg)}
            >
              <img src={bg.url} alt={bg.name} className={styles.cardImage} />
              <span className={styles.cardLabel}>{bg.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
