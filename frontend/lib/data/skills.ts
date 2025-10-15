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
    ],
  },
  {
    category: "Database & DevOps",
    skills: ["PostgreSQL","MySQL","CI/CD", "Nginx", "Git"],
  },
  {
    category: "Tools & Metodologias",
    skills: ["Agile/Scrum","Jira", "Postman", "VS Code", "Linux", "SOLID", "Clean Code"],
  },
]
