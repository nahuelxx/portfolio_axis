// Data provider for projects - follows Dependency Inversion Principle
export interface Project {
  id: string
  title: string
  description: string
  stack: string[]
  image: string
  githubUrl?: string
  demoUrl?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Sistema de Gestion Empresarial",
    description:
      "Plataforma completa para gestion de recursos, inventario y facturacion con dashboard en tiempo real.",
    stack: ["React", "Node.js", "PostgreSQL", "TypeScript", "Tailwind CSS"],
    image: "/modern-business-dashboard.png",
    githubUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
    featured: true,
  },
  {
    id: "2",
    title: "E-commerce Multivendor",
    description: "Marketplace escalable con sistema de pagos integrado, gestion de vendedores y analytics avanzados.",
    stack: ["Next.js", "Stripe", "MongoDB", "Redis", "AWS"],
    image: "/ecommerce-marketplace-interface.jpg",
    githubUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
    featured: true,
  },
  {
    id: "3",
    title: "App de Telemedicina",
    description:
      "Aplicacion para consultas medicas virtuales con videollamadas, historial clinico y recetas digitales.",
    stack: ["React Native", "WebRTC", "Firebase", "Node.js"],
    image: "/telemedicine-video-call-app.jpg",
    githubUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
  },
  {
    id: "4",
    title: "CRM para Inmobiliarias",
    description:
      "Sistema de gestion de propiedades, clientes y seguimiento de ventas con automatizacion de procesos.",
    stack: ["Vue.js", "Laravel", "MySQL", "Docker"],
    image: "/real-estate-crm-dashboard.png",
    githubUrl: "https://github.com",
  },
  {
    id: "5",
    title: "Plataforma Educativa",
    description:
      "LMS con cursos interactivos, evaluaciones automaticas y seguimiento de progreso estudiantil.",
    stack: ["Angular", "NestJS", "PostgreSQL", "GraphQL"],
    image: "/online-learning-platform.png",
    githubUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
  },
  {
    id: "6",
    title: "Sistema de Reservas",
    description:
      "Aplicacion para gestion de citas y reservas con calendario inteligente y notificaciones automaticas.",
    stack: ["React", "Express", "MongoDB", "Socket.io"],
    image: "/booking-calendar-system.jpg",
    githubUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
  },
]
