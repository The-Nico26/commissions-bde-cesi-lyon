from django.db import models
import logging

# Create your models here.
from raven.transport import requests

logger = logging.getLogger(__name__)

class Webhook(models.Model):

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=255, help_text="Un nom décrivant l'utilisation du WebHook")

    is_active = models.BooleanField(default=True, help_text="Si le WebHook est actif et peut être utilisé")

    event = models.CharField(max_length=100, choices=[
        ("commission-create", "Creation de commission")
    ], help_text="L'événement déclanchant l'appel au WebHook")

    type = models.CharField(max_length=100, choices=[
        ("discord", "Discord")
    ], help_text="Le format qui doit être utilisé pour éfféctuer la requète")

    url = models.CharField(max_length=512, help_text="L'URL à appeler pour éxécuter le WebHook")

    def trigger(self, force=False, fail_silently=True, **kwargs):
        if not self.is_active and not force:
            self.raise_error("Webhook '{}' disabled".format(self.name))
            return
        if self.type == "discord":
            self.trigger_discord(fail_silently=fail_silently, **kwargs)
        else:
            self.raise_error("Unimplemented webhook {} type {}".format(self.name, self.type), fail_silently)

    def trigger_discord(self, fail_silently=True, commission=None, commission_url="", commission_logo_url=""):
        message = ""
        embeds = []

        if self.event == "commission-create":

            message = "Une nouvelle commission débarque : {} !".format(commission.name)
            embed = {
                'title': commission.name,
                'description': commission.short_description,
                'url': commission_url,  # Si vous voulez faire un lien
                'thumbnail': {
                    'url': commission_logo_url
                },
                'fields': [
                ]
            }

            if commission.tags.count() > 0:

                tags = []

                for tag in commission.tags.all():
                    tags += [tag.name]

                embed["fields"] += [{
                    "name": "Tags",
                    "value": ", ".join(tags)
                }]

            embed["fields"] += [{
                "name": "Président",
                "value": commission.president.get_full_name()
            }]

            if commission.deputy is not None:
                embed["fields"] += [{
                    "name": "Suppléant",
                    "value": commission.deputy.get_full_name()
                }]

            if commission.treasurer is not None and commission.treasurer_id != commission.president_id:
                embed["fields"] += [{
                    "name": "Trésorier",
                    "value": commission.treasurer.get_full_name()
                }]

            embeds += [embed]

        else:
            self.raise_error("Unimplemented webhook discord event {}".format(self.type), fail_silently)
            return

        payload = {
            "content": message,
            "embeds": embeds
        }

        print(payload)

        webhookr = requests.post(self.url, json=payload, headers={
            'Content-Type': 'application/json',
            'user-agent': 'Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11'
        })

        if webhookr.status_code != 200:
            self.raise_error("Error during webhook request (code {}) : {}".format(webhookr.status_code, webhookr.text))
        else:
            logger.info("Triggered Discord webhook {}".format(self.name))

    def raise_error(self, message, fail_silently=True):
        if not fail_silently:
            raise ValueError(message)
        else:
            logger.error(message)
