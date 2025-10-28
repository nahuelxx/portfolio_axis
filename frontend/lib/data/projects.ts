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
    title: "App de Almacenamiento de Stock",
    description:
      "Aplicacion para consultas y movimientos de stock en una empresa informatica",
    stack: ["Django", "Python", "ApacheServer", "Postgres", "Bootstrap CSS", "Bash", "SSH"],
    image: "/netcell.png",
    githubUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
  },
  {
    id: "2",
    title: "Landing pages Services",
    description:
      "Creación de páginas web optimizadas para convertir visitantes en clientes potenciales",
    stack: ["Django", "Python", "React", "Node.js", "Tailwind CSS" ],
    image: "/online-learning-platform.png",
    githubUrl: "https://github.com",
  },
  {
    id: "3",
    title: "Sistema de Reservas",
    description:
      "Aplicacion para gestion de reservas hoteleras con calendario inteligente y notificaciones automaticas.",
    stack: ["Django", "Python", "Bootstrap CSS", "JavaScript"],
    image: "/reservas.png",
    githubUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
  },
  {
    id: "4",
    title: "Wizard de intercambio",
    description:
      "Asistente integrado a plataforma de E-commerce para la generacion de creditos a cambio de un producto de hardware ",
    stack: ["Django", "Python", "Tailwind CSS", "React", "Node.js"],
    image: "/wizardUX.png",
    githubUrl: "https://github.com",
    demoUrl: "https://demo.example.com",
  },
]
