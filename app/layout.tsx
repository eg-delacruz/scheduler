import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

//Schadcn UI components
import { Toaster } from 'sonner';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your Scheduler',
  description: 'A simple Scheduler to let others know your availability',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={outfit.className}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
