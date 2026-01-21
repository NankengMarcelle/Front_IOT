import type { Metadata } from "next";
import "./globals.css";
import { TranslationProvider } from "@/providers/TranslationProvider";
import { ConfirmDialogProvider } from "@/components/ConfirmDialog";
import { Toaster } from 'sonner';

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
      <body className="antialiased">
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