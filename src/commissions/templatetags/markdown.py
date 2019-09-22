from django import template
from django.template.defaultfilters import stringfilter
import markdown

register = template.Library()

@register.filter("markdown",)
@stringfilter
def markdownFilter(value):
    return markdown.markdown(value)
