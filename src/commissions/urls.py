from django.urls import path

from commissions.views import list_commissions, view_commission, create_commission, edit_commission, \
    edit_members_commission, action_membre

urlpatterns = [
    path("create", create_commission, name="commission_create"),
    path("<slug:slug>/manage/members", edit_members_commission, name="commission_edit_members"),
    path("<slug:slug>/manage", edit_commission, name="commission_edit"),
    path("<slug:slug>/action_membre/<slug:action>", action_membre, name="action_membre"),
    path("<slug:slug>", view_commission, name="commission_view"),
    path("", list_commissions, name="commission_list"),
]
