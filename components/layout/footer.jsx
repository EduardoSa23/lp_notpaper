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
              <li><Link href="/solucoes" className="transition-colors hover:text-white">Soluções</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Empresa</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/quem-somos" className="transition-colors hover:text-white">Quem Somos</Link></li>
              <li><Link href="/contato" className="transition-colors hover:text-white">Contato</Link></li>
              <li><Link href="/diretoria/login" className="transition-colors hover:text-white">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Telefone: <a href="tel:+551146040000" className="hover:text-white">(11) 4604-0000</a></li>
              <li>WhatsApp: <a href="https://wa.me/5511941398031" className="hover:text-white" target="_blank" rel="noreferrer">(11) 94139-8031</a></li>
              <li>E-mail: <a href="mailto:contato@notpaper.com.br" className="hover:text-white">contato@notpaper.com.br</a></li>
              <li>Endereço: <a href="https://www.google.com/maps/place/Av.+Dep.+Castro+de+Carvalho,+941+-+Vila+J%C3%BAlia,+Po%C3%A1+-+SP,+08551-035/@-23.5204327,-46.3569128,17z/data=!3m1!4b1!4m6!3m5!1s0x94ce7b25ec81d259:0x14c7d1f34875f531!8m2!3d-23.5204377!4d-46.3520419!16s%2Fg%2F11h4zprh16?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D" className="hover:text-white" target="_blank" rel="noreferrer">Av. Deputado Castro de Carvalho, 941, Poá - SP</a></li>
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

