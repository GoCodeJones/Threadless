import crypto from 'crypto';

export function generateMasterPassword(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    password += chars[randomIndex];
  }
  
  return password;
}

export function generateConnectionKey(): string {
  const key = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `${key.slice(0, 4)}-${key.slice(4, 8)}-${key.slice(8, 12)}`;
}