from django.db import models

from users.models import User


class Commissions(models.Model):
    """
    Le modèle contant toutes les informations d'une commission
    """

    # La commission est elle active et maintenue ?
    is_active = models.BooleanField(default=True)

    # Le nom de la commission
    name = models.CharField(max_length=255)

    # Une courte description de la commission en quelques mots
    short_description = models.CharField(max_length=255)

    # Une longue description formattée en Markdown
    description = models.TextField()

    # Le logo de la commission
    logo = models.ImageField(upload_to="commissions/logos")

    # La banière de la commission
    banner = models.ImageField(upload_to="commission/banners", blank=True, null=True)

    # L'utilisateur qui possède le rôle de président de la commission
    president = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='president_commissions')

    # L'utilisateur qui possède le rôle de trésorier de la commission
    treasurer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='treasurer_commissions')

    # L'utilisateur qui possède le rôle de suppléant de la commission
    deputy = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name='deputy_commissions')

    # La date de creation de la commission
    creation_date = models.DateTimeField(auto_now_add=True)

    # La date de dissolution de la commission
    end_date = models.DateTimeField(default=None, blank=True, null=True)
