from django.db import models

# Create your models here.
class QuickLink(models.Model):

	text = models.CharField(max_length=255, help_text="Court texte de description du lien")
	url = models.CharField(max_length=255)
	weight = models.IntegerField(help_text="Importance du lien (les plus importants seront les premiers)", default=0)

	style = models.CharField(max_length=50, choices=[
		("standard", "Standard"),
		("special", "Special")
	], default="standard", help_text="Style du lien")
	icon = models.CharField(max_length=255, default=None, blank=True, null=True, help_text="Icon du lien (format: mdi:[icon])")

	page = models.CharField(max_length=50, choices=[
		("index", "Page d'accueil")
	], default="index", help_text="Page d'affichage du lien")