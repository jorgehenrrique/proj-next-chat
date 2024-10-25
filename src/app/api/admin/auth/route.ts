import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const encodedHash = process.env.ADMIN_HASH_ENCODED;

    if (!encodedHash) {
      return NextResponse.json(
        { error: 'Configuração de admin não encontrada' },
        { status: 500 }
      );
    }

    // Decodifica a hash do base64
    const adminHash = Buffer.from(encodedHash, 'base64').toString();

    const isMatch = await bcrypt.compare(password, adminHash);

    if (isMatch) {
      return NextResponse.json({ success: true, token: adminHash });
    }

    return NextResponse.json(
      { error: 'Senha administrativa incorreta' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Erro na autenticação admin:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
