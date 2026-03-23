import Image from "next/image";
import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mx-auto mb-4 w-[50%] rounded-3xl bg-white px-4 py-1 md:mx-0">
              <Image src="/image/Logo_notpaper.png" alt="Logo notPaper" width={180} height={48} />
            </div>
            <p className="mb-4 text-center text-gray-400 md:text-left">Transformando negócios através da tecnologia e inovação.</p>
            <div className="flex justify-center space-x-4 md:justify-start">
              <a href="https://www.linkedin.com/company/silo-tecnologia/" className="text-gray-400 transition-colors hover:text-white" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Navegação</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link href="/comparacao" className="transition-colors hover:text-white">Comparação</Link></li>
              <li><Link href="/servicos" className="transition-colors hover:text-white">Serviços</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Empresa</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/quem-somos" className="transition-colors hover:text-white">Quem Somos</Link></li>
              <li><Link href="/contato" className="transition-colors hover:text-white">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="tel:+551146040000" className="hover:text-white">(11) 4604-0000</a></li>
              <li><a href="https://wa.me/5511941398031" className="hover:text-white" target="_blank" rel="noreferrer">(11) 94139-8031</a></li>
              <li><a href="mailto:contato@notpaper.com.br" className="hover:text-white">contato@notpaper.com.br</a></li>
              <li><a href="https://www.google.com/maps?q=São+Paulo,+SP" className="hover:text-white" target="_blank" rel="noreferrer">São Paulo, SP</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 notPaper. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
