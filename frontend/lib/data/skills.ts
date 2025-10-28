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
      "React Native",
    ],
  },
  {
    category: "Backend",
    skills: [
      "Python",
      "Django",
      "REST APIs",
      "Codex",
      "Prompt Engineering",
      "AGENTS.md"
    ],
  },
  {
    category: "Database & DevOps",
    skills: ["PostgreSQL","CI/CD", "Nginx", "Git"],
  },
  {
    category: "Tools & Metodologias",
    skills: ["Agile/Scrum","Linear", "Postman", "Thunder-Client", "VS Code", "Linux", "SOLID", "Clean Code"],
  },
]
