import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export async function generateHash() {
  const { ADMIN_PASSWORD } = process.env;

  if (!ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD não está definido no arquivo .env');
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(ADMIN_PASSWORD, salt);
    return hash;
  } catch (error) {
    console.error('Erro ao gerar o hash:', error);
    throw error;
  }
}

export function encodeHash(hash) {
  const encodedHash = Buffer.from(hash).toString('base64');
  return encodedHash;
}
