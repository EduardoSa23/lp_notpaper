import "./globals.css";
import { Inter } from "next/font/google";
import SiteLoading from "../components/layout/site-loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://notpaper.com.br"),
  title: "notPaper | Soluções Inteligentes para Gestão Pública",
  description:
    "A notPaper oferece GED, automação de processos e soluções digitais para transformar a gestão pública com eficiência, segurança e sustentabilidade.",
  keywords: ["gestão pública", "transformação digital", "GED", "automação", "prefeituras", "notPaper"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "notPaper | Soluções Inteligentes para Gestão Pública",
    description: "Automatize processos, digitalize documentos e modernize sua gestão com as soluções da notPaper.",
    url: "https://notpaper.com.br",
    siteName: "notPaper",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/image/Banner_Landing_Page.png",
        width: 1200,
        height: 630,
        alt: "notPaper - Soluções Inteligentes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "notPaper | Soluções Inteligentes para Gestão Pública",
    description: "Tecnologia para gestão pública com foco em eficiência, segurança e experiência do cidadão.",
    images: ["/image/Banner_Landing_Page.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} suppressHydrationWarning>
        <SiteLoading>{children}</SiteLoading>
      </body>
    </html>
  );
}
