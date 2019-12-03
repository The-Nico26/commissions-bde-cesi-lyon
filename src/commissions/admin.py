from django.contrib import admin

from commissions.models import Commission, Tag, Event, Post, PostImage, CommissionSocialQuester


@admin.register(Commission)
class CommissionsAdmin(admin.ModelAdmin):
    date_hierarchy = "creation_date"
    list_display = ("name", "short_description", "president", "creation_date")
    list_filter = ("is_organization", "organization_dependant", "is_active")
    search_fields = ('name', 'short_description', 'description', 'president', "treasurer", "deputy")
    ordering = ('is_organization', '-creation_date')

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

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    date_hierarchy = "date"
    list_display = ("date", "source", "commission", "content")
    list_filter = ("source", "commission", "is_moderated")
    search_fields = ('source', 'commission', 'content')
    ordering = ('-date',)

@admin.register(PostImage)
class PostImageAdmin(admin.ModelAdmin):
    list_display = ("post", "image")
    search_fields = ('post', 'image')

@admin.register(CommissionSocialQuester)
class CommissionSocialQuesterAdmin(admin.ModelAdmin):
    date_hierarchy = "since_date"
    list_display = ("commission", "query", "since_date")
    list_filter = ("commission",)
    search_fields = ('commission', 'query')
    ordering = ('-since_date',)
