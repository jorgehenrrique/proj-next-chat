import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/contexts/UserContext';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Chat Websocket',
  description: 'Created by Jorge Henrique',
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
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
