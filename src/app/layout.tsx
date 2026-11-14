import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'MarsBound · 14 Sols on Mars', description: 'Explore Jezero Crater with Rex. A science and survival expedition.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
