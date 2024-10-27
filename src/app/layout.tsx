import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';
import { RoomProvider } from '@/contexts/RoomContext';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const viewport: Viewport = {
  themeColor: '#020617',
};

export const metadata: Metadata = {
  title: 'ChatVortex',
  description:
    'ChatVortex é uma plataforma de chat interativa que oferece múltiplas experiências de comunicação: salas públicas, privadas e chat aleatório. Com uma interface moderna e intuitiva, permite criar salas personalizadas com senha, participar de conversas públicas ou conhecer novas pessoas através do matchmaking aleatório.',
  icons: {
    icon: [
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
  },
  other: {
    icon: '/favicon-32x32.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'ChatVortex',
    startupImage: '/favicon-32x32.png',
    statusBarStyle: 'black-translucent',
  },
  authors: [
    { name: 'Jorge Henrique', url: 'https://github.com/jorgehenrrique' },
  ],
  creator: 'Jorge Henrique',
  publisher: 'Jorge Henrique',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR' className='dark'>
      <body className={`${geistSans.variable} antialiased`}>
        <UserProvider>
          <RoomProvider>
            {children}
            <Toaster />
          </RoomProvider>
        </UserProvider>
      </body>
    </html>
  );
}
