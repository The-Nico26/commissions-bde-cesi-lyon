from django.urls import path

from commissions.views import list_commissions, view_commission, create_commission, edit_commission, \
    edit_members_commission, view_event

urlpatterns = [
    path("create", create_commission, name="commission_create"),
    path("<slug:slug>/manage/members", edit_members_commission, name="commission_edit_members"),
    path("<slug:slug>/manage", edit_commission, name="commission_edit"),
    path("<slug:slug>/event-<slug:eventslug>", view_event, name="commission_view_withevent"),
    path("<slug:slug>", view_commission, name="commission_view"),
    path("", list_commissions, name="commission_list"),
]
