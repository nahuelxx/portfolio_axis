// components/contact-section.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, AlertCircle, Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ⭐ Usa los wrappers de shadcn/ui para RHF:
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { sendContact } from "@/src/services/api"; 

type FormState = "idle" | "loading" | "success" | "error";

const SUBMIT_MIN_INTERVAL_MS = 3000;
const RESET_AFTER_MS = 5000;

const schema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "Contanos un poco más de tu proyecto"),
  honeypot: z.string(), // requerido-controlado
});

type ContactFormData = z.infer<typeof schema>;

export function ContactSection() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [lastSubmitAt, setLastSubmitAt] = useState<number>(
    () => Date.now() - SUBMIT_MIN_INTERVAL_MS // <- permite el 1er envío inmediato
  );
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "", honeypot: "" },
    mode: "onBlur",
  });

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  async function onSubmit(data: ContactFormData) {
    // honeypot
    if (data.honeypot) {
      console.warn("[contact] Spam detected via honeypot");
      return;
    }

    // rate limiting por rapidez
    const timeDiff = Date.now() - lastSubmitAt;
    if (timeDiff < SUBMIT_MIN_INTERVAL_MS) {
      setFormState("error");
      resetTimeoutRef.current = setTimeout(() => setFormState("idle"), 3000);
      return;
    }

    try {
      setFormState("loading");
      const result = await sendContact(data);

      if (!result?.ok || result?.email_sent === false) {
        // El backend pudo crear el recurso pero falló el envío SMTP.
        setFormState("error");
        resetTimeoutRef.current = setTimeout(() => setFormState("idle"), 3000);
        return;
      }

      setFormState("success");
      form.reset({ name: "", email: "", message: "", honeypot: "" });
      setLastSubmitAt(Date.now());
      resetTimeoutRef.current = setTimeout(() => setFormState("idle"), RESET_AFTER_MS);
    } catch (e) {
      console.error(e);
      setFormState("error");
      resetTimeoutRef.current = setTimeout(() => setFormState("idle"), 3000);
    }
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Hablemos de tu proyecto
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            ¿Tenés una idea? Estamos listos para convertirla en realidad.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-card border-border shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Mail className="w-5 h-5" aria-hidden="true" />
              Contacto
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Completá el formulario y te respondemos en menos de 24 horas.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                {/* Honeypot oculto */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="sr-only"
                  {...form.register("honeypot")}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Tu nombre completo"
                          disabled={formState === "loading" || form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="tu@email.com"
                          disabled={formState === "loading" || form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={5}
                          placeholder="Contanos sobre tu proyecto..."
                          className="resize-none"
                          disabled={formState === "loading" || form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {formState === "success" && (
                  <Alert variant="success" className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                    <AlertDescription>Mensaje enviado. ¡Te contactamos pronto!</AlertDescription>
                  </Alert>
                )}

                {formState === "error" && (
                  <Alert variant="destructive" className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" aria-hidden="true" />
                    <AlertDescription>
                      Enviamos demasiado rápido o hubo un error. Probá de nuevo en unos segundos.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={formState === "loading" || form.formState.isSubmitting}
                >
                  {formState === "loading" || form.formState.isSubmitting ? (
                    <>
                      <Spinner className="mr-2" />
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
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
