'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoginModal from './LoginModal'
import { useUserContext } from '../contexts/UserContext' // Importamos el contexto de usuario
import { FaUserCircle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, setUser } = useUserContext() // Accedemos al contexto de usuario
  const [isModalVisible, setModalVisible] = useState(false)
  const router = useRouter() // Usamos el router para redirigir al login si cierra sesión

  const toggleModal = () => setModalVisible(!isModalVisible)

  const handleLogout = () => {
    setUser(null) // Limpiamos el contexto del usuario
    sessionStorage.removeItem('user') // Limpiamos el sessionStorage
    router.push('/') // Redirigimos al login
  }

  // Actualizar el nombre de usuario y rol del contexto cuando se loguea
  useEffect(() => {
    if (user) {
      // Se actualiza si hay cambios en el contexto
      setUser(user)
    }
  }, [user, setUser])

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

          {/* Verifica si el usuario está autenticado */}
          {user ? (
            <div className="flex items-center gap-4">
              <FaUserCircle className="text-[#002855]" size={30} />
              <span className="text-[#002855]">{user.username}</span>
              {/* Muestra el rol del usuario */}
              <span className="text-[#002855] text-sm">{user.role}</span>
              {/* Botón de cerrar sesión */}
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              className="bg-[#002855] text-white px-4 py-2 rounded-md hover:bg-[#001f40] transition"
              onClick={toggleModal}
            >
              Iniciar sesión
            </button>
          )}
        </nav>
      </header>

      {/* Aquí agregamos la visibilidad del modal */}
      {isModalVisible && <LoginModal closeModal={toggleModal} />}
    </>
  )
}
