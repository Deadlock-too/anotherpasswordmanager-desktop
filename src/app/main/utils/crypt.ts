import { AES, enc } from 'crypto-js';

export const decrypt = (text: string, key: string) => {
  return AES.decrypt(text, key).toString(enc.Utf8);
}

export const encrypt = (text: string, key: string) => {
  return AES.encrypt(text, key).toString();
}