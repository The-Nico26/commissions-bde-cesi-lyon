from django.urls import path

from documentation.views import show_page

urlpatterns = [
    path("guide<path:path>", show_page, name="guide_subdocument"),
    path("guide", show_page, name="guide_index"),
]
