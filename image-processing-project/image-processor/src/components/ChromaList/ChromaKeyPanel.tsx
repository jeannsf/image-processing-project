import React from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './ChromaKeyPanel.module.css'
import { ChromaImage } from '../../types'

interface ChromaKeyPanelProps {
  images: ChromaImage[]
  onChange: (imgs: ChromaImage[]) => void
}

const ChromaKeyPanel: React.FC<ChromaKeyPanelProps> = ({ images, onChange }) => {
  const onDrop = (acceptedFiles: File[]) => {
    const newImgs: ChromaImage[] = acceptedFiles.map((file) => ({
      id: `${file.name}-${Date.now()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    onChange([...images, ...newImgs])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  })

  const handleRemove = (id: string) => {
    onChange(images.filter((img) => img.id !== id))
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Chroma Key</h2>

      <div
        {...getRootProps()}
        className={`${styles.dropzone} ${
          isDragActive ? styles.dropzoneActive : ''
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive
          ? 'Solte as imagens aqui'
          : 'Arraste imagens ou clique para selecionar'}
      </div>

      {images.length > 0 && (
        <div className={styles.previewList}>
          {images.map((img) => (
            <div key={img.id} className={styles.previewItem}>
              <img
                src={img.previewUrl}
                alt="Preview chroma"
                className={styles.previewImage}
              />
              <button
                type="button"
                onClick={() => handleRemove(img.id)}
                className={styles.removeButton}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChromaKeyPanel
