from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, SkillViewSet, ContactViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet)
router.register("skills", SkillViewSet)
router.register("contact", ContactViewSet, basename="contact")

urlpatterns = [
    path("", include(router.urls)),
]