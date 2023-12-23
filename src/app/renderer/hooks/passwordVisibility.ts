import { useState } from 'react'

export const usePasswordToggle = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(true)
  const [type, setType] = useState('password')
  const handlePasswordVisibility = () => {
    if (type === 'password') {
      setType('text')
    } else if (type === 'text') {
      setType('password')
    }
    setPasswordVisibility(!passwordVisibility)
  }
  return { type, passwordVisibility, handlePasswordVisibility }
}