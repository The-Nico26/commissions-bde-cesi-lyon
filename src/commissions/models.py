from datetime import timedelta

from django.db import models
from django.utils.text import slugify
from django.utils import timezone

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
    name = models.CharField(max_length=30)

    # Le nom de la commission modifié pour qu'il soit valide dans une URL
    slug = models.SlugField(unique=True, blank=True)

    # Une courte description de la commission en quelques mots
    short_description = models.CharField(max_length=60)

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

    # L'organisation en charge de la gestion de la commission (BDE ou BDS)
    organization_dependant = models.CharField(max_length=100, choices=[("bde", "BDE"), ("bds", "BDS")], default="bde", help_text="L'organisation à laquelle appartiens la commission")

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

    def has_add_event_permission(self, request):
        return self.has_change_permission(request)


class Event(models.Model):
    """
    Les évènements créés par les commissions
    """
    # Le nom de l'évènement
    name = models.CharField(max_length=100)

    # Le nom du tag modifié pour tenir dans une url
    slug = models.SlugField(unique=True, blank=True)

    # La description de l'évènement
    description = models.TextField()

    # Emplacement de l'événement
    location = models.CharField(max_length=255, blank=True, null=True)

    # Photo de l'évènement
    banner = models.ImageField(upload_to="events/photos")

    # Commission liée à l'évènement
    commission = models.ForeignKey(Commission, on_delete=models.SET_NULL, null=True, related_name='events')

    # La date de creation de l'évènement
    creation_date = models.DateTimeField(auto_now_add=True)

    # La date de dernière mise à jour de l'évènement
    update_date = models.DateTimeField(auto_now=True)

    # La date de début l'évènement
    event_date_start = models.DateTimeField()

    # La date de fin de l'évènement
    event_date_end = models.DateTimeField()

    def get_start_utc(self):
        return self.event_date_start - timedelta(hours=1)

    def get_end_utc(self):
        return self.event_date_end - timedelta(hours=1)

    def has_started(self):
        return self.event_date_start < timezone.now() and self.event_date_end > timezone.now()

    def has_ended(self):
        return self.event_date_end < timezone.now()

    def has_change_event_permission(self, request):
        return ((
            request.user.get_username() == self.commission.president.get_username()
        ) or (
            request.user.get_username() == self.commission.treasurer.get_username()
        ) or (
            self.commission.deputy is not None and request.user.get_username() == self.commission.deputy.get_username()
        ))

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Event, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

