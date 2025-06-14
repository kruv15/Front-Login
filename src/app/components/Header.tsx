// src/app/components/Header.tsx
'use client'

import Link from 'next/link'

export default function Header() {
  return (
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
        <button className="bg-[#002855] text-white px-4 py-2 rounded-md hover:bg-[#001f40] transition">
          Iniciar sesión
        </button>
      </nav>
    </header>
  )
}
