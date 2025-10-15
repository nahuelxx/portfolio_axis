from django.db import models

# Create your models here.

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to="projects/", null=True, blank=True)
    link_demo = models.URLField(blank=True)
    link_repo = models.URLField(blank=True)
    stack = models.CharField(max_length=200)

    def __str__(self):
        return self.title


class Skill(models.Model):
    name = models.CharField(max_length=50)
    category = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.category} - {self.name}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"