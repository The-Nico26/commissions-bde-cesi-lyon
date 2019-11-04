from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()


@register.filter("escapelines",)
@stringfilter
def escapeLinesFilter(value):
    return value.replace("\n", "\\n").replace("\r", "")

