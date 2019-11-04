from django.contrib import admin

from webhooks.models import Webhook

@admin.register(Webhook)
class WebhookAdmin(admin.ModelAdmin):
    date_hierarchy = "created_at"
    list_display = ("name", "type", "event", "is_active")
    search_fields = ('name', 'url', 'type', 'trigger')
    ordering = ('-created_at',)
