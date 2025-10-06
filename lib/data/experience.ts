// Data provider for experience - follows Single Responsibility Principle
export interface Experience {
  id: string
  company: string
  role: string
  period: string
  achievements: string[]
  current?: boolean
}

export const experienceData: Experience[] = [
  {
    id: "1",
    company: "Axis.soft",
    role: "Tech Lead & Co-Founder",
    period: "2022 - Presente",
    current: true,
    achievements: [
      "Liderazgo de un equipo de 8 desarrolladores en proyectos enterprise.",
      "Implementacion de arquitectura escalable que redujo costos de infraestructura en 40%.",
      "Desarrollo de mas de 15 proyectos exitosos para clientes en LATAM y Europa.",
      "Definicion de estandares de codigo y mejores practicas (SOLID, Clean Code).",
    ],
  },
  {
    id: "2",
    company: "TechCorp Solutions",
    role: "Senior Full Stack Developer",
    period: "2020 - 2022",
    achievements: [
      "Construccion de plataforma SaaS con mas de 50K usuarios activos mensuales.",
      "Optimizacion de rendimiento que mejoro tiempos de carga en 60%.",
      "Mentoria de cinco desarrolladores junior en tecnologias modernas.",
      "Migracion exitosa de monolito a arquitectura de microservicios.",
    ],
  },
  {
    id: "3",
    company: "Digital Innovations",
    role: "Full Stack Developer",
    period: "2018 - 2020",
    achievements: [
      "Construccion de mas de diez aplicaciones web y moviles desde cero.",
      "Implementacion de sistema de CI/CD que redujo el tiempo de despliegue en 70%.",
      "Integracion de pasarelas de pago y servicios de terceros.",
      "Colaboracion con clientes para definir requerimientos tecnicos.",
    ],
  },
  {
    id: "4",
    company: "StartupLab",
    role: "Junior Developer",
    period: "2016 - 2018",
    achievements: [
      "Desarrollo de funcionalidades frontend con React y Vue.js.",
      "Participacion activa en code reviews y pair programming.",
      "Aprendizaje y adopcion de metodologias agiles y trabajo en equipo.",
      "Contribucion a proyectos open source de la empresa.",
    ],
  },
]
