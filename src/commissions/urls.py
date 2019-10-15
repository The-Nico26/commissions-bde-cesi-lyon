from django.urls import path

from commissions.views import list_commissions, view_commission, create_commission, edit_commission, \
    edit_members_commission, view_event, commission_dashboard, calendar, calendar_explain, create_event

urlpatterns = [
    path("create", create_commission, name="commission_create"),
    path("events", calendar_explain, name="calendar_explain"),
    path("events.ics", calendar, name="calendar"),
    path("<slug:slug>/manage/members", edit_members_commission, name="commission_edit_members"),
    path("<slug:slug>/manage/edit", edit_commission, name="commission_edit"),
    path("<slug:slug>/manage", commission_dashboard, name="commission_dashboard"),
    path("<slug:slug>/manage/event--create", create_event, name="create_event"),
    path("<slug:slug>/event-<slug:eventslug>", view_event, name="commission_view_withevent"),
    path("<slug:slug>", view_commission, name="commission_view"),
    path("", list_commissions, name="commission_list"),
]
