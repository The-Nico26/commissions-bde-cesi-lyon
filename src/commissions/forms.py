from django import forms

from commissions.models import Tag
from commissions.models import User
from commissions.models import Commission
from commissions.models import Event
from django.forms import ModelForm, SelectDateWidget, SplitDateTimeWidget


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


class UserSelectorWidget(forms.Select):

    option_inherits_attrs = True
    template_name = 'widgets/user-selector.html'

    def create_option(self, name, value, label, selected, index, subindex=None, attrs=None):

        if index > 0 and type(self.choices.queryset[index-1]) is User:
            usr = self.choices.queryset[index-1]
            attributes = {
                "data-name": usr.get_full_name(),
                "data-email": usr.email,
            }
            if usr.profile_picture != "":
                attributes["data-profile-picture"] = "/media/{}".format(usr.profile_picture)
        else:
            attributes = None

        return super().create_option(name, value, label, selected, index, subindex, attributes)


class MarkdownWidget(forms.Textarea):
    template_name = 'widgets/markdown.html'


class DateTimePickerWidget(SplitDateTimeWidget):
    template_name = 'widgets/datetimepicker.html'


class CreateCommissionForm(forms.Form):
    name = forms.CharField(label='Nom', max_length=30, required=True)
    short_description = forms.CharField(label='Courte description', max_length=60, required=True)
    tags = forms.ModelMultipleChoiceField(label='Tags', queryset=Tag.objects.all(), to_field_name="name", widget=TagSelectorWidget(max_selection=3), required=False)

    logo = forms.ImageField(required=True, label='Logo', widget=ImageSelectorWidget)
    banner = forms.ImageField(required=True, label='Bannière', widget=ImageSelectorWidget)

    treasurer = forms.ModelChoiceField(queryset=User.objects.all(), label='Trésorier·ere', required=False, widget=UserSelectorWidget)
    substitute = forms.ModelChoiceField(queryset=User.objects.all(), label='Suppléant·e', widget=UserSelectorWidget, required=False)

    description = forms.CharField(label='Description', widget=MarkdownWidget, required=True)


class EditCommissionForm(ModelForm):
    class Meta:
        model = Commission
        fields = ['name', 'description', 'short_description', 'tags', 'logo', 'banner']
        labels = {
            "name": "Nom",
            "short_description": "Courte description",
            "description": "Description",
            "tags": "Tags",
            "logo": "Logo",
            "banner": "Bannière"
        }
        widgets = {
            'tags': TagSelectorWidget(max_selection=3),
            'description': MarkdownWidget,
            'logo': ImageSelectorWidget(attrs={"data-description": "Changer le logo"}),
            'banner': ImageSelectorWidget(attrs={"data-description": "Changer la bannière"})
        }


class EditCommissionMembersForm(ModelForm):
    class Meta:
        model = Commission
        fields = ['deputy', 'treasurer', 'president']
        labels = {
            'treasurer': "Trésorier·ere",
            'deputy': "Suppléant·e",
            'president': "Président·e"
        }
        widgets = {
            'treasurer': UserSelectorWidget,
            'deputy': UserSelectorWidget,
            'president': UserSelectorWidget
        }


class CreateEditEventForm(ModelForm):
    class Meta:
        model = Event
        fields = ['name', 'description', 'banner', 'event_date_start', 'event_date_end']
        labels = {
            'name': 'Nom de l\'évènement',
            'description': 'Description',
            'banner': 'Bannière',
            'event_date_start': 'Date de début de l\'évènement',
            'event_date_end': 'Date de fin de l\'évènement'
        }
        widgets = {
            'description': MarkdownWidget,
            'event_date_start': DateTimePickerWidget,
            'event_date_end': DateTimePickerWidget,
            'banner': ImageSelectorWidget(attrs={"data-description": "Changer la bannière"})
        }


