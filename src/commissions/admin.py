from django.contrib import admin

from commissions.models import Commission, Tag, Event


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

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    date_hierarchy = "event_date_start"
    list_display = ("name", "commission", "location", "event_date_start")
    search_fields = ('name', 'description', "location", "commission")
    ordering = ('-event_date_start',)