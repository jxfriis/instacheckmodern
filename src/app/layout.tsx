import type { Metadata, Viewport } from "next";
import { Figtree, Rubik } from "next/font/google";

import { ThemeProvider } from "@/providers/theme-provider";
import { I18nProvider } from "@/providers/i18n-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/hooks/use-toast";
import { MotionProvider } from "@/providers/motion-provider";

import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  display: "swap",
});

const themeInitScript = `(function(){try{var raw=localStorage.getItem('instacheck-theme');var t=raw?JSON.parse(raw):null;var dark=t!=='light';document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light';}catch(e){document.documentElement.classList.add('dark');}})();`;

export const metadata: Metadata = {
  title: "InstaCheck — Find those who don't follow back",
  description:
    "Compare your Instagram following and followers lists to see exactly who doesn't follow you back. Private by design — your data never leaves your browser.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="da"
      suppressHydrationWarning
      className={`${figtree.variable} ${rubik.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <I18nProvider>
            <TooltipProvider>
              <MotionProvider>
                <ToastProvider>{children}</ToastProvider>
              </MotionProvider>
            </TooltipProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
