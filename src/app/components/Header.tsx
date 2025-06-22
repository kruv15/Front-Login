'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoginModal from './LoginModal'
import { useUserContext } from '../contexts/UserContext'
import { FaUserCircle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, setUser } = useUserContext()
  const [isModalVisible, setModalVisible] = useState(false)
  const router = useRouter()

  const toggleModal = () => setModalVisible(!isModalVisible)

  const handleLogout = () => {
    setUser(null)
    sessionStorage.removeItem('user')
    router.push('/')
  }

  useEffect(() => {
    if (user) {
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

          {user ? (
            <div className="flex items-center gap-4">
              <FaUserCircle className="text-[#002855]" size={30} />
              <span className="text-[#002855] text-sm capitalize">{user.role}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                className="bg-[#002855] text-white px-4 py-2 rounded-md hover:bg-[#001f40] transition"
                onClick={toggleModal}
              >
                Iniciar sesión
              </button>
              <Link
                href="/registro"
                className="border border-[#002855] text-[#002855] px-4 py-2 rounded-md hover:bg-[#002855] hover:text-white transition"
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      </header>

      {isModalVisible && <LoginModal closeModal={toggleModal} />}
    </>
  )
}
