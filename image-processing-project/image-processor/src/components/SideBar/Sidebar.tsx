import React from 'react'
import { Background } from '../../types'
import styles from './SideBar.module.css'

interface SidebarProps {
  items: Background[]
  selected: Background[]
  onSelect: (bgList: Background[]) => void
}

const Sidebar: React.FC<SidebarProps> = ({ items, selected, onSelect }) => {
  const handleClick = (bg: Background) => {
    const alreadySelected = selected.find((b) => b.id === bg.id)

    if (alreadySelected) {
      onSelect(selected.filter((b) => b.id !== bg.id))
    } else {
      const updated = [...selected, bg]
      if (updated.length > 5) {
        updated.shift() 
      }
      onSelect(updated)
    }
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Backgrounds</h2>
      <div className={styles.panelScrollable}>
        {items.map((bg) => {
          const isSelected = selected.some((b) => b.id === bg.id)
          return (
            <div
              key={bg.id}
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => handleClick(bg)}
            >
              <img src={bg.url} alt={bg.name} className={styles.cardImage} />
              <span className={styles.cardLabel}>{bg.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar
