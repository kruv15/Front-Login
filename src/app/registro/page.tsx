'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasenia: '',
    fechaNacimiento: '',
    celular: '',
    pais: '',
    ciudad: '',
  })

  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const { nombre, apellido, correo, contrasenia, fechaNacimiento, celular, pais, ciudad } =
      formData

    if (
      !nombre ||
      !apellido ||
      !correo ||
      !contrasenia ||
      !fechaNacimiento ||
      !celular ||
      !pais ||
      !ciudad
    ) {
      setError('Todos los campos son obligatorios')
      return false
    }

    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      setError('Correo inválido')
      return false
    }

    if (contrasenia.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return false
    }

    if (!/^\d{8}$/.test(celular)) {
      setError('El número de celular debe tener 8 dígitos')
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    alert('¡Registro exitoso!')
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e6f0fa] to-[#dce6f7] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#002855]">
          Registro de Estudiante
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="input-plain"
            onChange={handleChange}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            className="input-plain"
            onChange={handleChange}
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            className="input-plain"
            onChange={handleChange}
          />
          <input
            type="password"
            name="contrasenia"
            placeholder="Contraseña"
            className="input-plain"
            onChange={handleChange}
          />
          <input
            type="date"
            name="fechaNacimiento"
            className="input-plain col-span-1 md:col-span-2"
            onChange={handleChange}
          />
          <input
            type="text"
            name="celular"
            placeholder="Celular (8 dígitos)"
            className="input-plain"
            onChange={handleChange}
          />
          <input
            type="text"
            name="pais"
            placeholder="País"
            className="input-plain"
            onChange={handleChange}
          />
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            className="input-plain"
            onChange={handleChange}
          />

          {error && <p className="text-red-600 text-sm col-span-2">{error}</p>}

          <button
            type="submit"
            className="bg-[#002855] text-white px-4 py-2 rounded-md w-full col-span-2 hover:bg-[#001f40]"
          >
            Registrarse
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-[#002855] hover:underline hover:text-[#001f40]"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </main>
  )
}
