from django import forms

from commissions.models import Tag
from commissions.models import User


class CreateCommissionForm(forms.Form):
    name = forms.CharField(label='Nom', max_length=100, required=True)
    short_description = forms.CharField(label='Courte description', max_length=200, required=True)
    tags = forms.ModelMultipleChoiceField(label='Tags', queryset=Tag.objects.all(), to_field_name="name", widget=forms.SelectMultiple)

    logo = forms.ImageField(required=True, label='Logo')
    banner = forms.ImageField(required=True, label='Bannière')

    has_treasurer = forms.BooleanField(label="Je suis le trésorier", widget=forms.CheckboxInput, required=False, initial=True)
    treasurer = forms.ModelChoiceField(queryset=User.objects.all(), label='Trésorier·ere', required=False, widget=forms.Select)
    whant_substitute = forms.BooleanField(label="Je veux un·e suppléant·e", widget=forms.CheckboxInput, required=False, initial=False)
    substitute = forms.ModelChoiceField(queryset=User.objects.all(), label='Suppléant·e', widget=forms.Select, required=False)

    description = forms.CharField(label='Description', widget=forms.Textarea, required=True)
