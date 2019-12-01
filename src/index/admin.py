from django.contrib import admin

# Register your models here.
from index.models import QuickLink


@admin.register(QuickLink)
class QuickLinkAdmin(admin.ModelAdmin):
    fieldsets = (
        (None, {'fields': ('text', 'url')}),
        ("Organisation", {'fields': ('weight', 'page')}),
        ("Apparence", {'fields': ('style', 'icon')})
    )
    list_display = ('text', 'url', 'page', 'weight')
    search_fields = ('text', 'url')
    ordering = ('page', '-weight', 'text')
    list_filter = ("page", )
