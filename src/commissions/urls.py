from django.urls import path

from commissions.views import list_commissions, view_commission, create_commission, edit_commission, edit_members_commission, view_event, commission_dashboard, calendar, calendar_explain, add_edit_event, action_membre

urlpatterns = [
    path("create", create_commission, name="commission_create"),
    path("events", calendar_explain, name="calendar_explain"),
    path("events.ics", calendar, name="calendar"),
    
    path("<slug:slug>/manage/members", edit_members_commission, name="commission_edit_members"),
    path("<slug:slug>/action_membre/<slug:action>", action_membre, name="action_membre"),
    path("<slug:slug>/manage/edit", edit_commission, name="commission_edit"),
    path("<slug:slug>/manage", commission_dashboard, name="commission_dashboard"),
    path("<slug:com_slug>/manage/event--create", add_edit_event, name="create_event"),
    path("<slug:com_slug>/manage/event-<slug:slug>", add_edit_event, name="edit_event"),
    path("<slug:slug>/event-<slug:eventslug>", view_event, name="view_event"),
    path("<slug:slug>", view_commission, name="commission_view"),
    path("", list_commissions, name="commission_list"),
]
