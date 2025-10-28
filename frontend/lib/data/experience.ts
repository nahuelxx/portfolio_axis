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
    period: "2025 - Presente",
    current: true,
    achievements: [
      "Equipo de 2 desarrolladores en proyectos de software.",
      "Implementacion de arquitectura escalable que reduce costos de infraestructura.",
      "Definicion de estandares de codigo y mejores practicas (SOLID, Clean Code).",
    ],
  },
  {
    id: "2",
    company: "StartupLab- NetCell",
    role: "Junior Developer",
    period: "Mayo 2023 - Septiembre 2023",
    achievements: [
      "Desarrollo de funcionalidades backend con Python + Django",
      "Participacion activa en code reviews y pair programming.",
      "Aprendizaje y adopcion de metodologias agiles y trabajo en equipo.",
      "Contribucion a proyectos open source de la empresa.",
    ],
  },
]
