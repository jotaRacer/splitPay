# Split Pay - React Application

Una aplicación React moderna para dividir pagos a través de diferentes blockchains con tus amigos.

## 🏗️ Arquitectura Modular

El proyecto sigue principios de **Clean Code** con una arquitectura modular bien organizada:

### 📁 Estructura de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI base (Button, Card, Input, etc.)
│   ├── layout/         # Componentes de layout (Header, Footer, etc.)
│   └── forms/          # Componentes de formularios
├── features/           # Funcionalidades específicas del dominio
│   ├── splits/         # Lógica de splits de pagos
│   ├── contributions/  # Lógica de contribuciones
│   └── wallet/         # Lógica de wallet y conexión
├── pages/              # Páginas de la aplicación
├── hooks/              # Custom hooks reutilizables
├── services/           # Servicios y APIs
├── contexts/           # Contextos de React
├── types/              # Definiciones de tipos TypeScript
├── utils/              # Utilidades y helpers
├── lib/                # Librerías y configuraciones
└── config/             # Configuraciones de la aplicación
```

### 🎯 Principios de Clean Code Aplicados

1. **Separación de Responsabilidades**: Cada carpeta tiene una responsabilidad específica
2. **Componentes Reutilizables**: UI components modulares y reutilizables
3. **Tipado Fuerte**: TypeScript para mejor mantenibilidad
4. **Arquitectura por Features**: Organización por funcionalidades del dominio
5. **Configuración Centralizada**: Configuraciones en archivos dedicados

### 🚀 Tecnologías Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Radix UI** - Componentes de UI accesibles
- **React Router** - Navegación
- **Lucide React** - Iconos
- **React Hook Form** - Manejo de formularios

### 📱 Características

- **Diseño Responsivo**: Optimizado para móvil y desktop
- **Componentes Modulares**: Fácil mantenimiento y escalabilidad
- **Tipado Fuerte**: TypeScript para mejor DX
- **Accesibilidad**: Componentes accesibles con Radix UI
- **Performance**: Optimizado con React 19

### 🛠️ Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# Construir para producción
npm run build
```

### 🎨 Componentes Principales

- **MobileHeader**: Header responsive con navegación
- **QuickActions**: Acciones rápidas para splits
- **SplitCard**: Tarjeta de información de split
- **ContributionProgress**: Progreso de contribuciones
- **UI Components**: Button, Card, Input, Badge, Progress

### 🔧 Configuración

El proyecto incluye:
- Configuración de Tailwind CSS con variables CSS personalizadas
- Tipos TypeScript bien definidos
- Estructura modular escalable
- Componentes UI reutilizables

### 📊 Estado del Proyecto

✅ **Completado**:
- Arquitectura modular implementada
- Componentes UI adaptados de Next.js a React
- Routing configurado con React Router
- Estilos y configuración de Tailwind
- Tipos TypeScript definidos
- Página principal funcional

🔄 **En Desarrollo**:
- Páginas adicionales (Setup, Contribute)
- Integración con wallets
- Funcionalidades de blockchain

La aplicación está lista para usar y expandir con nuevas funcionalidades siguiendo la arquitectura modular establecida.
