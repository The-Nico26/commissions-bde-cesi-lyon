from django.db import models


class Document(models.Model):

    created_at = models.DateTimeField(auto_now=True)
    role = models.CharField(max_length=100, choices=[("status", "Status"), ("reglement-interieur", "Règlement interieur")])
    file = models.FileField(upload_to="documents")
    current_version = models.BooleanField(default=False)
