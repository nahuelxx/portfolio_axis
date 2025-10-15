from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet, SkillViewSet, ContactViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="projects")
router.register(r"skills", SkillViewSet, basename="skills")
router.register(r"contact", ContactViewSet, basename="contact")

urlpatterns = [
    path("", include(router.urls)),
]

