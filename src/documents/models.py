from django.db import models


class Document(models.Model):

    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=100, choices=[("status", "Status"), ("reglement-interieur", "Règlement interieur"), ("status-bds", "Status du BDS"), ("reglement-interieur-bds", "Règlement interieur du BDS")], help_text="De quel type de document sagit il")
    file = models.FileField(upload_to="documents", help_text="Le fichier du document pouvant être téléchargé")
    current_version = models.BooleanField(default=False, help_text="Le document est il la dernière version qui sera affichée sur le site")
