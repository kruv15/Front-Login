'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nombre_estudiante: '',
    apellido_estudiante: '',
    correo_estudiante: '',
    contrasenia: '',
    fecha_nacimiento: '',
    numero_celular: '',
    id_pais: '',
    id_ciudad: '',
  })

  const [paises, setPaises] = useState<any[]>([])
  const [ciudades, setCiudades] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://microservice-estudiante.onrender.com/api/paises')
      .then(res => res.json())
      .then(data => setPaises(data.data))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'id_pais') {
      setFormData(prev => ({ ...prev, id_ciudad: '' }))
      fetch(`https://microservice-estudiante.onrender.com/api/ciudades/${value}`)
        .then(res => res.json())
        .then(data => setCiudades(data.data))
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

    if (!/^\d{2}-\d{2}-\d{4}$/.test(fecha_nacimiento)) {
      setError('La fecha debe tener formato dd-mm-aaaa')
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await fetch('https://microservice-estudiante.onrender.com/api/estudiantes/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Error en el servidor')

      alert('¡Registro exitoso!')
      router.push('/')
    } catch (err) {
      setError('No se pudo registrar. Intente nuevamente.')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e6f0fa] to-[#dce6f7] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#002855]">Registro de Estudiante</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="nombre_estudiante" placeholder="Nombre" className="input-plain" onChange={handleChange} />
          <input type="text" name="apellido_estudiante" placeholder="Apellido" className="input-plain" onChange={handleChange} />
          <input type="email" name="correo_estudiante" placeholder="Correo" className="input-plain" onChange={handleChange} />
          <input type="password" name="contrasenia" placeholder="Contraseña" className="input-plain" onChange={handleChange} />
          <input type="text" name="fecha_nacimiento" placeholder="dd-mm-aaaa" className="input-plain col-span-1 md:col-span-2" onChange={handleChange} />
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

          <button type="submit" className="bg-[#002855] text-white px-4 py-2 rounded-md w-full col-span-2 hover:bg-[#001f40]">
            Registrarse
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => router.push('/')} className="text-sm text-[#002855] hover:underline hover:text-[#001f40]">
            ← Volver al inicio
          </button>
        </div>
      </div>
    </main>
  )
}
