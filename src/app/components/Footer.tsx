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
            <a href="#" className="hover:underline">
              Sitio web UMSS
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Calendario Académico
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Biblioteca Virtual
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline">
              Reglamentos Académicos
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-2">Síguenos</h4>
        <div className="flex gap-3 text-xl mt-2">
          <FaFacebookF className="cursor-pointer hover:text-[#1877F2] active:text-[#145db2]" />
          <FaInstagram className="cursor-pointer hover:text-[#C13584] active:text-[#a02b6d]" />
          <FaTwitter className="cursor-pointer hover:text-black active:text-gray-800" />
          <FaLinkedinIn className="cursor-pointer hover:text-[#0077b5] active:text-[#005c8d]" />
          <FaWhatsapp className="cursor-pointer hover:text-[#25D366] active:text-[#1da851]" />
          <FaTelegramPlane className="cursor-pointer hover:text-[#0088cc] active:text-[#006699]" />
          <FaTiktok className="cursor-pointer hover:text-black active:text-gray-800" />
        </div>
        <p className="mt-4 text-sm">© 2025 Universidad Mayor de San Simón</p>
      </div>
    </footer>
  )
}
