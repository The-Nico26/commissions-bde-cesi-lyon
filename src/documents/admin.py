from django.contrib import admin

from src.documents import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    date_hierarchy = "created_at"
    list_display = ("role", "created_at", "current_version")
    search_fields = ('role',)
    ordering = ('-created_at',)
