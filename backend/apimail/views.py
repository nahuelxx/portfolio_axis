from rest_framework import viewsets, status
from rest_framework.response import Response

from django.conf import settings
from django.core.mail import EmailMessage

from .models import Project, Skill, ContactMessage
from .serializers import ProjectSerializer, SkillSerializer, ContactSerializer

import logging

logger = logging.getLogger(__name__)


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all().order_by("id")
    serializer_class = ProjectSerializer


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all().order_by("category")
    serializer_class = SkillSerializer


class ContactViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by("-created_at")
    serializer_class = ContactSerializer

    def create(self, request, *args, **kwargs):
        data = request.data.copy()

        # Honeypot: si viene relleno, respondemos 201 silencioso
        if data.get("honeypot"):
            logger.warning("[contact] Spam detectado via honeypot")
            return Response({"ok": True}, status=status.HTTP_201_CREATED)

        # Ignorar campos extra no definidos en el modelo (p.ej. honeypot)
        data.pop("honeypot", None)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Enviar correo a tu casilla, con Reply-To del usuario
        try:
            user_email = serializer.validated_data.get("email")
            user_name = serializer.validated_data.get("name")
            message_text = serializer.validated_data.get("message")

            body = (
                f"Nombre: {user_name}\n"
                f"Email: {user_email}\n\n"
                f"Mensaje:\n{message_text}"
            )

            msg = EmailMessage(
                subject=f"Nuevo mensaje de {user_name}",
                body=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[getattr(settings, "CONTACT_RECIPIENT", settings.DEFAULT_FROM_EMAIL)],
                reply_to=[user_email] if user_email else None,
            )
            msg.send(fail_silently=False)
            return Response({"ok": True, "email_sent": True}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception("Error enviando email de contacto: %s", e)
            # En desarrollo, respondemos 201 para no romper la UX
            return Response({"ok": True, "email_sent": False}, status=status.HTTP_201_CREATED)

