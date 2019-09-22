from django.contrib import admin

from src.commissions.models import Commission, Tag


@admin.register(Commission)
class CommissionsAdmin(admin.ModelAdmin):
    date_hierarchy = "creation_date"
    list_display = ("name", "short_description", "president", "creation_date")
    search_fields = ('name', 'short_description', 'description', 'president', "treasurer", "deputy")
    ordering = ('-creation_date',)

@admin.register(Tag)
class TagsAdmin(admin.ModelAdmin):
    list_display = ("name", "color")
    search_fields = ("name", "color")
    ordering = ("name",)
