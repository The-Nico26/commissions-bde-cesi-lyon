from django.db import models
from django.utils.text import slugify

from users.models import User


class Tag(models.Model):
    """
    Les tags associable aux commissions pour les trier et les retrouver
    """
    # Le nom du tag
    name = models.CharField(max_length=100)

    # Le nom du tag modifié pour tenir dans une URL
    slug = models.SlugField(unique=True, blank=True)

    # Couleur du tag
    color = models.CharField(max_length=20)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Tag, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Commission(models.Model):
    """
    Le modèle contant toutes les informations d'une commission
    """

    # La commission est elle active et maintenue ?
    is_active = models.BooleanField(default=True)

    # Le nom de la commission
    name = models.CharField(max_length=255)

    # Le nom de la commission modifié pour qu'il soit valide dans une URL
    slug = models.SlugField(unique=True, blank=True)

    # Une courte description de la commission en quelques mots
    short_description = models.CharField(max_length=255)

    # Une longue description formattée en Markdown
    description = models.TextField()

    # Le logo de la commission
    logo = models.ImageField(upload_to="commission/logos")

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

    # Les tags de la commission
    tags = models.ManyToManyField(Tag, blank=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Commission, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

    def has_change_permission(self, request):
        return self.is_active and ((
            request.user.get_username() == self.president.get_username()
        ) or (
            request.user.get_username() == self.treasurer.get_username()
        ) or (
            self.deputy is not None and request.user.get_username() == self.deputy.get_username()
        ))

    def has_change_members_permission(self, request):
        return self.is_active and request.user.get_username() == self.president.get_username()
