"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { AlertCircle, CheckCircle2, Mail, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Single Responsibility: Contact form with validation
export function ContactSection() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [formData, setFormData] = useState({ name: "", email: "", message: "", honeypot: "" })
  const [submitTime, setSubmitTime] = useState<number>(() => Date.now())
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current)
      submitTimeoutRef.current = null
    }
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (formData.honeypot) {
      console.warn("[contact] Spam detected via honeypot")
      return
    }

    const timeDiff = Date.now() - submitTime
    if (timeDiff < 3000) {
      console.warn("[contact] Form submitted too quickly")
      setFormState("error")
      resetTimeoutRef.current = setTimeout(() => {
        setFormState("idle")
        resetTimeoutRef.current = null
      }, 3000)
      return
    }

    clearTimers()
    setFormState("loading")
    setSubmitTime(Date.now())

    submitTimeoutRef.current = setTimeout(() => {
      setFormState("success")
      setFormData({ name: "", email: "", message: "", honeypot: "" })
      setSubmitTime(Date.now())
      resetTimeoutRef.current = setTimeout(() => {
        setFormState("idle")
        resetTimeoutRef.current = null
      }, 5000)
    }, 1500)
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">Hablemos de tu proyecto</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Tienes una idea? Estamos listos para convertirla en realidad.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Mail className="w-5 h-5" aria-hidden="true" />
              Contacto
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Completa el formulario y te responderemos en menos de 24 horas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="website"
                value={formData.honeypot}
                onChange={(event) => setFormData({ ...formData, honeypot: event.target.value })}
                className="sr-only"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nombre *
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  placeholder="Tu nombre completo"
                  className="bg-background border-border text-foreground"
                  disabled={formState === "loading"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  placeholder="tu@email.com"
                  className="bg-background border-border text-foreground"
                  disabled={formState === "loading"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">
                  Mensaje *
                </Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  placeholder="Cuentanos sobre tu proyecto..."
                  rows={5}
                  className="bg-background border-border text-foreground resize-none"
                  disabled={formState === "loading"}
                />
              </div>

              {formState === "success" && (
                <div
                  className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                  role="status"
                >
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <p className="text-sm font-medium">Mensaje enviado. Te contactaremos pronto.</p>
                </div>
              )}

              {formState === "error" && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                  <AlertCircle className="w-5 h-5" aria-hidden="true" />
                  <p className="text-sm font-medium">
                    Enviamos demasiado rapido. Intenta nuevamente en unos segundos.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={formState === "loading"}
              >
                {formState === "loading" ? (
                  <>
                    <span
                      className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                      aria-hidden="true"
                    />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                    Enviar mensaje
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
