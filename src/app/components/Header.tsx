'use client'

import { useState } from 'react'
import Link from 'next/link'
import LoginModal from './LoginModal' // Importamos el modal de inicio de sesión

export default function Header() {
  const [isModalVisible, setModalVisible] = useState(false)

  const toggleModal = () => setModalVisible(!isModalVisible)

  return (
    <>
      <header className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-umss.png" alt="Logo UMSS" className="w-10 h-10" />
          <div className="text-xl font-semibold text-[#002855]">Campus Virtual UMSS</div>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/" className="text-[#002855] hover:underline">
            Inicio
          </Link>
          <Link href="#sobre" className="text-gray-600 hover:underline">
            Sobre la plataforma
          </Link>
          {/* Cambiamos el botón a un enlace de tipo botón para abrir el modal */}
          <button
            className="bg-[#002855] text-white px-4 py-2 rounded-md hover:bg-[#001f40] transition"
            onClick={toggleModal}
          >
            Iniciar sesión
          </button>
        </nav>
      </header>

      {/* Aquí agregamos la visibilidad del modal */}
      {isModalVisible && <LoginModal closeModal={toggleModal} />}
    </>
  )
}
