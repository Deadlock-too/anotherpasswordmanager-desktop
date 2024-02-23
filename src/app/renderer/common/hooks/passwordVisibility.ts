import { useState } from 'react'

export const usePasswordToggle = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(true)
  const [type, setType] = useState('password')
  const togglePasswordVisibility = () => {
    if (type === 'password') {
      setType('text')
    } else if (type === 'text') {
      setType('password')
    }
    setPasswordVisibility(!passwordVisibility)
  }
  return { type, passwordVisibility, togglePasswordVisibility }
}