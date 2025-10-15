from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Project, Skill, ContactMessage
from .serializers import ProjectSerializer, SkillSerializer, ContactSerializer
from django.core.mail import send_mail
from django.conf import settings
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

        # enviar correo (SMTP o Anymail)
        try:
            send_mail(
                subject=f"Nuevo mensaje de {serializer.data['name']}",
                message=serializer.data["message"],
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=["nahuue2@gmail.com"],
                fail_silently=False,
            )
            return Response({"ok": True, "email_sent": True}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception("Error enviando email de contacto: %s", e)
            # Aún así devolvemos 201 para no romper la UX en desarrollo
            return Response({"ok": True, "email_sent": False}, status=status.HTTP_201_CREATED)
