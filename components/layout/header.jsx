import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "../ui/back-to-top";
import { BtnWhatsapp } from "../ui/btn-whatsapp";

export default function SiteHeader() {
  return (
    <div className="relative z-50">
      <header className="fixed inset-x-0 top-0 bg-white/90 shadow-lg">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center" aria-label="Ir para a Home">
            <Image src="/image/Logo_notpaper.png" alt="Logo da notPaper" width={180} height={48} className="h-10 w-auto" priority />
          </Link>

          <div className="hidden items-center space-x-8 md:flex">
            <Link href="/" className="text-gray-700 transition-colors hover:text-[#0043FE]">
              Home
            </Link>
            <Link href="/solucoes" className="text-gray-700 transition-colors hover:text-[#0043FE]">
              Soluções
            </Link>
            <Link href="/quem-somos" className="text-gray-700 transition-colors hover:text-[#0043FE]">
              Quem Somos
            </Link>
            <Link href="/comparacao" className="text-gray-700 transition-colors hover:text-[#0043FE]">
              Comparar Soluções
            </Link>
            <Link href="/contato" className="text-gray-700 transition-colors hover:text-[#0043FE]">
              Contato
            </Link>
          </div>

          <div className="hidden md:block">
            <BtnWhatsapp>
              Começar Agora
            </BtnWhatsapp>
          </div>

          <details className="relative md:hidden">
            <summary className="list-none cursor-pointer">
              <span className="sr-only">Abrir menu principal</span>
              <svg className="h-7 w-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </summary>

            <div className="absolute right-0 z-50 mt-3 flex w-56 max-w-[calc(100vw-2rem)] flex-col space-y-1 rounded-lg bg-white px-6 py-4 shadow-lg">
              <Link href="/" className="block border-b py-2 text-gray-700 transition-colors hover:text-[#0043FE]">
                Home
              </Link>
              <Link href="/comparacao" className="block border-b py-2 text-gray-700 transition-colors hover:text-[#0043FE]">
                Comparação
              </Link>
              <Link href="/solucoes" className="block border-b py-2 text-gray-700 transition-colors hover:text-[#0043FE]">
                Soluções
              </Link>
              <Link href="/quem-somos" className="block border-b py-2 text-gray-700 transition-colors hover:text-[#0043FE]">
                Quem Somos
              </Link>
              <Link href="/contato" className="block py-2 text-gray-700 transition-colors hover:text-[#0043FE]">
                Contato
              </Link>
            </div>
          </details>
        </nav>
      </header>

      <BackToTop />
    </div>
  );
}
