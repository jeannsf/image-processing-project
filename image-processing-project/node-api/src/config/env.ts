import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] ?? defaultValue
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is required but was not provided.`)
  }
  return value
}

export const env = {
  PORT: Number(getEnvVar('PORT', '3000')),
  PYTHON_API_URL: getEnvVar('PYTHON_API_URL'),
}
