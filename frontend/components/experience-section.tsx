import { Briefcase } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { experienceData } from "@/lib/data/experience"

// Single Responsibility: Experience timeline display
export function ExperienceSection() {
  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">Experiencia Profesional</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Trayectoria construyendo soluciones de software de alto impacto.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {experienceData.map((exp) => (
            <Card
              key={exp.id}
              className="bg-card border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Briefcase className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground mb-1">{exp.role}</CardTitle>
                      <p className="text-base font-medium text-muted-foreground">{exp.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={exp.current ? "default" : "secondary"}
                      className={
                        exp.current ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {exp.period}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <span
                        className="mt-2 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                      <span className="text-sm leading-relaxed text-pretty">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
