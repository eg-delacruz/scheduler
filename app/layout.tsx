import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

//Schadcn UI components
import { Toaster } from 'sonner';

//Context
import { AppWrapper } from '@context/index';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your Scheduler',
  description: 'A simple Scheduler to let others know your availability',
};

//TODO: The "image.domains" configuration is deprecated. Please use "images.remotePatterns" configuration instead.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={outfit.className}>
        <AppWrapper>
          <Toaster />
          {children}
          <script async defer src='https://apis.google.com/js/api.js'></script>
          <script
            async
            defer
            src='https://accounts.google.com/gsi/client'
          ></script>
        </AppWrapper>
      </body>
    </html>
  );
}
