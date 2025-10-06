// Data provider for skills - follows Open/Closed Principle
export interface SkillCategory {
  category: string
  skills: string[]
}

export const skillsData: SkillCategory[] = [
  {
    category: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Vue.js",
      "Angular",
      "Redux",
      "React Native",
      "Webpack",
      "Vite",
    ],
  },
  {
    category: "Backend",
    skills: [
      "Node.js",
      "Express",
      "NestJS",
      "Python",
      "Django",
      "Laravel",
      "GraphQL",
      "REST APIs",
      "Microservices",
      "WebSockets",
    ],
  },
  {
    category: "Database & DevOps",
    skills: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Docker", "Kubernetes", "AWS", "CI/CD", "Nginx", "Git"],
  },
  {
    category: "Tools & Metodologias",
    skills: ["Agile/Scrum", "Jest", "Cypress", "Figma", "Jira", "Postman", "VS Code", "Linux", "SOLID", "Clean Code"],
  },
]
