from django.urls import path

from adminutils.views import export_commissions
from index import views

urlpatterns = [
    path("export/commissions.csv", export_commissions, name="export_commissions")
]