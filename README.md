# Sumaj Code - Front-Login

Bienvenido al repositorio del **Frontend de Login** de **Sumaj Code**, una plataforma educativa pensada para enseñar programación en Python de forma práctica, visual y flexible.

Esta parte del sistema permite a los usuarios autenticarse y acceder a los entornos de estudiante, docente y administración, conectándose con microservicios internos que manejan la lógica de usuarios.

---

## ¿Qué es Sumaj Code?

Sumaj Code es mucho más que una plataforma: es una experiencia de aprendizaje interactiva, donde los estudiantes avanzan a su propio ritmo, combinando teoría, práctica y simulaciones.

Entre sus principales características se encuentran:

- Módulos de aprendizaje organizados y accesibles
- Foro estilo chat para dudas y colaboración
- Lecciones multimedia (PDF, videos, imágenes)
- Compilador Python en línea con feedback en tiempo real
- Simuladores visuales para entender cómo funciona el código

---

## Tecnologías utilizadas

Este proyecto fue desarrollado usando:

- [Next.js 15](https://nextjs.org/)
- [React 19](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Turbopack](https://turbo.build/pack) (para desarrollo más rápido)

---

## Instalación

Ten instalado Node.js (v18 o superior). Luego:

```bash
# Clona el repositorio
git clone https://github.com/SumajCode/Front-Login.git
cd Front-Login

# Instala las dependencias
npm install

# Si hay errores con Tailwind o PostCSS, ejecuta:
npm install autoprefixer
npm install -D tailwindcss postcss autoprefixer

# Inicia el servidor de desarrollo
npm run dev
