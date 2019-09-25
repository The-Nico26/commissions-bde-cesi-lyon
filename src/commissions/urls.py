from django.urls import path

from commissions.views import list_commissions, view_commission, create_commission, edit_commission, \
    edit_members_commission, manage_commission_social

urlpatterns = [
    path("create", create_commission, name="commission_create"),
    path("<slug:slug>/manage/members", edit_members_commission, name="commission_edit_members"),
    path("<slug:slug>/manage/social", manage_commission_social, name="commission_manage_social"),
    path("<slug:slug>/manage", edit_commission, name="commission_edit"),
    path("<slug:slug>", view_commission, name="commission_view"),
    path("", list_commissions, name="commission_list"),
]
