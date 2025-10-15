export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  honeypot: string; // requerido (campo controlado)
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function sendContact(payload: ContactPayload) {
  const res = await fetch(`${API_URL}/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.detail || "Error al enviar el mensaje");
  }
  return res.json();
}
