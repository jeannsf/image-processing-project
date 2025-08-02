import React from 'react'
import { Background } from '../../types'
import styles from './SideBar.module.css'

interface SidebarProps {
  items: Background[]
  selected: Background[]
  onSelect: (bgList: Background[]) => void
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Backgrounds</h2>
      <div className={styles.panelScrollable}>
        {items.map((bg) => (
          <div key={bg.id} className={styles.card}>
            <img src={bg.url} alt={bg.name} className={styles.cardImage} />
            <span className={styles.cardLabel}>{bg.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
