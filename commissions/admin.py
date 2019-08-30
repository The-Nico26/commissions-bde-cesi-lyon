from django.contrib import admin

from commissions.models import Commission


@admin.register(Commission)
class CommissionsAdmin(admin.ModelAdmin):
    date_hierarchy = "creation_date"
    list_display = ("name", "short_description", "president", "creation_date")
    search_fields = ('name', 'short_description', 'description', 'president', "treasurer", "deputy")
    ordering = ('-creation_date',)
