import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"

import { projects } from "@/lib/data/projects"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Single Responsibility: Projects display component
export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">Proyectos Destacados</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Soluciones innovadoras desarrolladas con las ultimas tecnologias.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-border"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 text-foreground">{project.title}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4 text-pretty">
                  {project.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="bg-secondary text-secondary-foreground">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-2">
                {project.githubUrl && (
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {project.demoUrl && (
                  <Button asChild size="sm" className="flex-1">
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
