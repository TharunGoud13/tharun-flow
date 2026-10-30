import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'tharun-flow — Technical Architecture & Diagramming Canvas',
  description: 'Fast, professional architecture diagrams and diagram-as-code for engineering teams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full w-full overflow-hidden bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
