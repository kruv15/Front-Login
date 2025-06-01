# Next.js Frontend Project

Este es un proyecto frontend creado con Next.js 15.3.1, TypeScript y TailwindCSS.

## Tecnologías incluidas

- **Next.js 15.3.1** con App Router
- **TypeScript** para tipado estático
- **TailwindCSS** para estilos
- **ESLint** y **Prettier** para linting y formateo
- **Framer Motion** para animaciones
- **Lucide React** para iconos

## Scripts disponibles

\`\`\`bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción
npm run lint         # Ejecuta ESLint
npm run lint:fix     # Ejecuta ESLint y corrige errores automáticamente
npm run format       # Formatea el código con Prettier
npm run type-check   # Verifica los tipos de TypeScript
\`\`\`

## Estructura del proyecto

\`\`\`
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── lib/
    └── utils.ts
\`\`\`

## Configuración

El proyecto incluye configuraciones personalizadas para:

- **TypeScript** con path aliases (`@/*` → `./src/*`)
- **ESLint** con Flat Config
- **Prettier** con reglas personalizadas
- **TailwindCSS** con variables CSS
- **PostCSS** con autoprefixer
- **ShadCN UI** listo para usar

## Instalación

\`\`\`bash
npm install
npm run dev
\`\`\`

El proyecto estará disponible en [http://localhost:3000](http://localhost:3000).
