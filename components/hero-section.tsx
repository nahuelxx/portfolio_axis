import { ArrowDown } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Single Responsibility: Hero section presentation
export function HeroSection() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        {/* Geometric shapes with subtle animations */}
        <div className="geometric-shape geometric-circle-1" />
        <div className="geometric-shape geometric-circle-2" />
        <div className="geometric-shape geometric-square-1" />
        <div className="geometric-shape geometric-square-2" />
        <div className="geometric-shape geometric-triangle-1" />
        <div className="geometric-shape geometric-triangle-2" />
        <div className="geometric-shape geometric-circle-3" />
        <div className="geometric-shape geometric-square-3" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight text-balance">
                AXIS
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground font-light">Descripcion de la empresa</p>
              <p className="text-base sm:text-lg text-muted-foreground/80 max-w-xl mx-auto lg:mx-0 text-pretty">
                Software development solutions and more...
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="#about-us">About us</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border hover:bg-accent bg-transparent">
                <a href="#contact">Contacto</a>
              </Button>
            </div>
          </div>

          {/* Right side - Avatar */}
          <div className="flex justify-center lg:justify-end">
            <Avatar className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 border-4 border-border shadow-2xl">
              <AvatarImage src="/team-highfive.png" alt="Axis.soft Team" className="object-cover object-center" />
              <AvatarFallback className="text-6xl font-bold bg-muted text-muted-foreground">AS</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16 lg:mt-24">
          <a
            href="#projects"
            className="text-muted-foreground hover:text-foreground transition-colors animate-bounce"
            aria-label="Scroll to projects"
          >
            <ArrowDown className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  )
}
