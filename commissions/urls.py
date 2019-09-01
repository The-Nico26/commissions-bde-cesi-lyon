from django.urls import path

from commissions.views import list_commissions, view_commission

urlpatterns = [
    path("<slug:slug>", view_commission, name="commission_view"),
    path("", list_commissions, name="commission_list"),
]
