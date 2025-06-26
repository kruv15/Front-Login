'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getPaises,
  getCiudades,
  registrarEstudiante,
  EstudiantePayload,
  Pais,
  Ciudad,
} from '../services/estudianteService'

export default function RegistroPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<EstudiantePayload>({
    nombre_estudiante: '',
    apellido_estudiante: '',
    correo_estudiante: '',
    contrasenia: '',
    fecha_nacimiento: '',
    numero_celular: '',
    id_pais: '',
    id_ciudad: '',
  })

  const [paises, setPaises] = useState<Pais[]>([])
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPaises().then(setPaises)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'fecha_nacimiento') {
      const cleaned = value.replace(/\D/g, '').slice(0, 8)
      let formatted = ''
      for (let i = 0; i < cleaned.length; i++) {
        if (i === 2 || i === 4) formatted += '-'
        formatted += cleaned[i]
      }
      setFormData(prev => ({ ...prev, [name]: formatted }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (name === 'id_pais') {
      setFormData(prev => ({ ...prev, id_ciudad: '' }))
      getCiudades(value).then(setCiudades)
    }
  }

  const validateForm = () => {
    const {
      nombre_estudiante,
      apellido_estudiante,
      correo_estudiante,
      contrasenia,
      fecha_nacimiento,
      numero_celular,
      id_pais,
      id_ciudad,
    } = formData

    if (
      !nombre_estudiante || !apellido_estudiante || !correo_estudiante ||
      !contrasenia || !fecha_nacimiento || !numero_celular || !id_pais || !id_ciudad
    ) {
      setError('Todos los campos son obligatorios')
      return false
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(nombre_estudiante)) {
      setError('El nombre solo debe contener letras')
      return false
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(apellido_estudiante)) {
      setError('El apellido solo debe contener letras')
      return false
    }

    if (!/^\S+@\S+\.\S+$/.test(correo_estudiante)) {
      setError('Correo inválido')
      return false
    }

    if (contrasenia.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return false
    }

    if (!/^\d{8}$/.test(numero_celular)) {
      setError('El número de celular debe tener 8 dígitos numéricos')
      return false
    }

    const partes = fecha_nacimiento.split('-')
    const fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`
    if (partes.length !== 3 || isNaN(new Date(fechaFormateada).getTime())) {
      setError('Fecha inválida. Usa el formato dd-mm-aaaa')
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await registrarEstudiante(formData)
      const successMessage = 'Estudiante creado exitosamente'

      if (response.message === successMessage || response.success) {
        setError(null)
        alert('¡Registro exitoso!\nEl estudiante fue registrado correctamente.')
        router.push('/')
      } else {
        setError(response.message || 'No se pudo registrar. Intente nuevamente.')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('No se pudo registrar. Intente nuevamente.')
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#9b1c2f] via-[#5b274d] to-[#002855] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#002855] border-b pb-3">Registro de Estudiante</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="nombre_estudiante" placeholder="Nombre" className="input-plain" onChange={handleChange} />
          <input type="text" name="apellido_estudiante" placeholder="Apellido" className="input-plain" onChange={handleChange} />
          <input type="email" name="correo_estudiante" placeholder="Correo electrónico" className="input-plain" onChange={handleChange} />
          <input type="password" name="contrasenia" placeholder="Contraseña" className="input-plain" onChange={handleChange} />
          <input
            type="text"
            name="fecha_nacimiento"
            placeholder="dd-mm-aaaa"
            maxLength={10}
            className="input-plain col-span-1 md:col-span-2"
            onChange={handleChange}
            value={formData.fecha_nacimiento}
          />
          <input type="text" name="numero_celular" placeholder="Celular (8 dígitos)" className="input-plain" onChange={handleChange} />

          <select name="id_pais" value={formData.id_pais} className="input-plain" onChange={handleChange}>
            <option value="">Seleccione un país</option>
            {paises.map(p => (
              <option key={p.id_pais} value={p.id_pais}>{p.nombre_pais}</option>
            ))}
          </select>

          <select name="id_ciudad" value={formData.id_ciudad} className="input-plain" onChange={handleChange} disabled={!ciudades.length}>
            <option value="">Seleccione una ciudad</option>
            {ciudades.map(c => (
              <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre_ciudad}</option>
            ))}
          </select>

          {error && <p className="text-red-600 text-sm col-span-2">{error}</p>}

          <button type="submit" className="bg-[#002855] text-white px-4 py-2 rounded-md w-full col-span-2 hover:bg-[#001f40] transition">
            Registrarse
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => router.push('/')} className="text-sm text-[#002855] hover:underline hover:text-[#001f40] transition">
            ← Volver al inicio
          </button>
        </div>
      </div>
    </main>
  )
}
