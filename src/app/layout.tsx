import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TranslationProvider } from "@/providers/TranslationProvider";
import { ConfirmDialogProvider } from "@/components/ConfirmDialog";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Agro",
  description: "The soil speaks. We listen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <TranslationProvider>
          <ConfirmDialogProvider>
            {children}
          </ConfirmDialogProvider>
        </TranslationProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}