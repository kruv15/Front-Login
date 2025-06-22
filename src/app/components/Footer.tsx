import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegramPlane,
  FaTiktok,
} from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-[#002855] text-white py-10 px-6 grid md:grid-cols-3 gap-6">
      <div>
        <h4 className="font-bold mb-2">Soporte Técnico</h4>
        <p>Email: soporte.campus@umss.edu</p>
        <p>Teléfono: (591) 4-4525252</p>
        <p>Horario: Lunes a Viernes, 8:00 - 18:00</p>
      </div>

      <div>
        <h4 className="font-bold mb-2">Enlaces Institucionales</h4>
        <ul className="space-y-1">
          <li>
            <a
              href="https://www.umss.edu.bo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Sitio web UMSS
            </a>
          </li>
          <li>
            <a
              href="https://websis.umss.edu.bo/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              WebSIS
            </a>
          </li>
          <li>
            <a
              href="http://plataforma.dpa.umss.edu.bo/documentos/Estatuto_Organico_UMSS.PDF"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Reglamento Académico
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-2">Síguenos</h4>
        <div className="flex gap-3 text-xl mt-2">
          <a
            href="https://www.facebook.com/umssboloficial"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF className="cursor-pointer hover:text-[#1877F2]" />
          </a>
          <a
            href="https://www.instagram.com/umss_oficial/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="cursor-pointer hover:text-[#C13584]" />
          </a>
          <a href="https://twitter.com/UMSS_Bolivia" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="cursor-pointer hover:text-black" />
          </a>
          <a
            href="https://www.linkedin.com/school/universidad-mayor-de-san-simon/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn className="cursor-pointer hover:text-[#0077b5]" />
          </a>
          <a href="https://wa.me/59144444444" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="cursor-pointer hover:text-[#25D366]" />
          </a>
          <a href="https://t.me/umss_bot" target="_blank" rel="noopener noreferrer">
            <FaTelegramPlane className="cursor-pointer hover:text-[#0088cc]" />
          </a>
          <a href="https://www.tiktok.com/@umssoficial" target="_blank" rel="noopener noreferrer">
            <FaTiktok className="cursor-pointer hover:text-black" />
          </a>
        </div>
        <p className="mt-4 text-sm">© 2025 Universidad Mayor de San Simón</p>
      </div>
    </footer>
  )
}
