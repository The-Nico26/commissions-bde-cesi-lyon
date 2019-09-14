from django import forms
from django.http import request

from commissions.models import Tag
from commissions.models import User


class NameForm(forms.Form):
    name = forms.CharField(label='Nom', max_length=100, required=True)
    description = forms.CharField(label='Description', max_length=2000, required=True)
    tags = forms.ModelMultipleChoiceField(queryset=Tag.objects.all(), empty_label=None, to_field_name="name", widget=forms.SelectMultiple)
    logo = forms.ImageField(required=True)
    banner = forms.ImageField(required=True)
    treasurer = forms.ModelChoiceField(queryset=User.objects.all(), required=True, widget=forms.Select)
    president = forms.ModelChoiceField(queryset=User, required=True )
    substitute = forms.ModelChoiceField(queryset=User.objects.all(), widget=forms.Select)