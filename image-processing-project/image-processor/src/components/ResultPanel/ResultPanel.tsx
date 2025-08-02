import React from 'react'
import { ResultImage } from '../../types'
import { downloadImage } from '../../utils/download'
import { Download } from 'lucide-react'

import styles from './ResultPanel.module.css'

interface ResultPanelProps {
  results: ResultImage[]
  loading: boolean
}

const ResultPanel: React.FC<ResultPanelProps> = ({ results, loading }) => {
  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Resultados</h2>

      {loading && (
        <div className={styles.overlay}>
          <div className={styles.spinner} />
          Processando...
        </div>
      )}

      <div className={styles.grid}>
        {results.map((res) => (
          <div key={res.id} className={styles.item}>
            <div className={styles.imageWrapper}>
              <img
                src={res.url}
                alt="Resultado"
                className={styles.image}
              />
              <Download
                className={styles.downloadIcon}
                size={20}
                onClick={() =>
                  downloadImage(res.url, `resultado-${res.id}.png`)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultPanel
