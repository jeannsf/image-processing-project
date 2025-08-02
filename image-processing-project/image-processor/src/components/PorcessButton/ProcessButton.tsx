import React from 'react'
import styles from './ProcessButton.module.css'
import { Play } from 'lucide-react' // ou qualquer biblioteca que estiver usando

interface ProcessButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  showIcon?: boolean
}

const ProcessButton: React.FC<ProcessButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  children = 'Processar',
  showIcon = true,
  ...rest
}) => (
  <button
    type="button"
    className={`${styles.button} ${className}`}
    onClick={onClick}
    disabled={disabled}
    {...rest}
  >
    {showIcon && <Play size={18} className={styles.icon} />}
    {children}
  </button>
)

export default ProcessButton
