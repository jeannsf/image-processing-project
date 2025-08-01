import React from 'react'
import styles from './ProcessButton.module.css'

interface ProcessButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

const ProcessButton: React.FC<ProcessButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  children = 'Processar',
  ...rest
}) => (
  <button
    type="button"
    className={`${styles.button} ${className}`}
    onClick={onClick}
    disabled={disabled}
    {...rest}
  >
    {children}
  </button>
)

export default ProcessButton
