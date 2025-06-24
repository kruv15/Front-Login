"use client"

import { useState } from "react"
import Link from "next/link"
import LoginModal from "./LoginModal"
import { useUserContext } from "../contexts/UserContext"
import { FaUserCircle } from "react-icons/fa"
import Image from 'next/image';

export default function Header() {
  console.log("🎯 Header - COMPONENTE INICIANDO")

  const { user, isLoading, logout, checkAndRedirectIfAuthenticated } = useUserContext()
  const [isModalVisible, setModalVisible] = useState(false)

  console.log("📊 Header - Estado del contexto:", {
    user: user ? { id: user._id, email: user.email, role: user.role } : null,
    isLoading,
    isModalVisible,
  })

  const toggleModal = () => {
    console.log("🎭 Header - toggleModal INICIANDO")
    console.log("🔍 Header - Estado actual del modal:", isModalVisible)

    const newModalState = !isModalVisible
    console.log("🔄 Header - Cambiando estado del modal a:", newModalState)
    setModalVisible(newModalState)
  }

  const handleLogout = async () => {
    console.log("🚪 Header - handleLogout INICIANDO")

    try {
      console.log("📡 Header - Llamando función logout del contexto...")
      await logout()
      console.log("✅ Header - Logout completado")
    } catch (error) {
      console.error("💥 Header - Error durante logout:", error)
    }
  }

  console.log("🎯 Header - RENDERIZANDO con estado:", {
    hasUser: !!user,
    isLoading,
    isModalVisible,
  })

  return (
    <>
      <header className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo-umss.png" alt="Logo" width={100} height={100} />
          <div className="text-xl font-semibold text-[#002855]">Campus Virtual UMSS</div>
        </div>

        <nav className="flex gap-6 items-center">
          <Link
            href="/"
            className="text-[#002855] hover:underline"
            onClick={() => console.log("🔗 Header - Click en enlace Inicio")}
          >
            Inicio
          </Link>
          <Link
            href="#sobre"
            className="text-gray-600 hover:underline"
            onClick={() => console.log("🔗 Header - Click en enlace Sobre la plataforma")}
          >
            Sobre la plataforma
          </Link>

          {isLoading ? (
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#002855]"></div>
              <span className="text-[#002855] text-sm">Verificando sesión...</span>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <FaUserCircle className="text-[#002855]" size={30} />
              <span className="text-[#002855] text-sm capitalize">{user.role}</span>
              <button
                onClick={() => {
                  console.log("🚪 Header - Click en botón Cerrar sesión")
                  handleLogout()
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                className="bg-[#002855] text-white px-4 py-2 rounded-md hover:bg-[#001f40] transition"
                onClick={() => {
                  console.log("🔑 Header - Click en botón Iniciar sesión")
                  toggleModal()
                }}
              >
                Iniciar sesión
              </button>
              <Link
                href="/registro"
                className="border border-[#002855] text-[#002855] px-4 py-2 rounded-md hover:bg-[#002855] hover:text-white transition"
                onClick={() => console.log("📝 Header - Click en enlace Registrarse")}
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      </header>

      {isModalVisible && (
        <>
          {console.log("🎭 Header - Renderizando LoginModal")}
          <LoginModal
            closeModal={() => {
              console.log("🚪 Header - Cerrando modal desde Header")
              toggleModal()
            }}
          />
        </>
      )}
    </>
  )
}
