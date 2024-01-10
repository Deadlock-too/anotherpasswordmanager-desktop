import { AES, enc } from 'crypto-js';

export const decrypt = (text: string, key: string) => {
  try {
    return AES.decrypt(text, key).toString(enc.Utf8)
  }
  catch (e) {
    return ''
  }
}

export const encrypt = (text: string, key: string) => {
  return AES.encrypt(text, key).toString()
}