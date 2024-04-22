import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { neobrutalism } from '@clerk/themes';
import { cn } from '@/lib/utils';

import { ThemeProvider } from '@/components/providers/theme-providers';
import { ModalProvider } from '@/components/providers/modal-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Discord Clone',
  abstract: 'A Discord clone built with Next.js',
  description: 'A Discord clone built with Next.js and Tailwind CSS with real-time messaging using Socket.IO and Clerk for authentication.',
  applicationName: 'Discord Clone',
  appLinks: {
    web: {
      url: 'https://rendyp-discord.up.railway.app',
      should_fallback: false,
    }
  },
  archives: 'https://github.com/Rendy752/Discord-Clone',
  authors: [
    {
      name: 'Rendy Pratama',
      url: 'https://github.com/Rendy752',
    }
  ],
  category: 'Social',
  classification: 'Social',
  creator: 'Rendy Pratama',
  formatDetection: {
    telephone: true,
  },
  generator: 'Next.js',
  publisher: 'Railway',
  keywords: ['discord', 'clone', 'social', 'chat', 'messaging', 'realtime', 'nextjs', 'tailwindcss', 'prisma', 'socket.io', 'clerk'],
  referrer: 'no-referrer',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: neobrutalism,
      variables: { colorPrimary: 'blue' },
      signIn: { 
        variables: { colorPrimary: 'red' },
      }
    }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, 'bg-white dark:bg-[#313338] h-full')}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
