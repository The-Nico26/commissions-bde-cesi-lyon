from django import forms

from commissions.models import Tag
from commissions.models import User

class TagSelectorWidget(forms.SelectMultiple):

    option_inherits_attrs = True
    template_name = 'widgets/tag-selector.html'
    max_selection = None

    def __init__(self, attrs=None, choices=(), max_selection=None):
        self.max_selection = max_selection

        if self.max_selection is not None:
            if attrs is not None:
                attrs = {**attrs, "data-max": max_selection}
            else:
                attrs = {"data-max": max_selection}

        super().__init__(attrs, choices)

    def create_option(self, name, value, label, selected, index, subindex=None, attrs=None):

        if type(self.choices.queryset[index]) is Tag:
            attributes = {"data-color" : self.choices.queryset[index].color}
        else:
            attributes = None

        return super().create_option(name, value, label, selected, index, subindex, attributes)


class ImageSelectorWidget(forms.FileInput):
    template_name = "widgets/image-selector.html"


class CreateCommissionForm(forms.Form):
    name = forms.CharField(label='Nom', max_length=100, required=True)
    short_description = forms.CharField(label='Courte description', max_length=200, required=True)
    tags = forms.ModelMultipleChoiceField(label='Tags', queryset=Tag.objects.all(), to_field_name="name", widget=TagSelectorWidget(max_selection=3), required=False)

    logo = forms.ImageField(required=True, label='Logo', widget=ImageSelectorWidget)
    banner = forms.ImageField(required=True, label='Bannière', widget=ImageSelectorWidget)

    has_treasurer = forms.BooleanField(label="Je suis le trésorier", widget=forms.CheckboxInput, required=False, initial=True)
    treasurer = forms.ModelChoiceField(queryset=User.objects.all(), label='Trésorier·ere', required=False, widget=forms.Select)
    whant_substitute = forms.BooleanField(label="Je veux un·e suppléant·e", widget=forms.CheckboxInput, required=False, initial=False)
    substitute = forms.ModelChoiceField(queryset=User.objects.all(), label='Suppléant·e', widget=forms.Select, required=False)

    description = forms.CharField(label='Description', widget=forms.Textarea, required=True)
