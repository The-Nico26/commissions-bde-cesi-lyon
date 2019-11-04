import logging
import os
from datetime import timedelta

from django.core.mail import send_mail
from django.shortcuts import render, get_object_or_404, redirect
from django.template.loader import render_to_string
from django.utils import timezone

from bdecesi import settings
from commissions.models import Commission, Event, MembreCommission
from commissions.forms import CreateCommissionForm, EditCommissionForm, EditCommissionMembersForm, EventForm

from django.contrib import messages
from commissions.models import Tag
from django.db.models import Q

from users.models import User
from webhooks.models import Webhook

logger = logging.getLogger(__name__)

def list_commissions(request):

    commissions = Commission.objects.filter(is_organization=False).order_by("-creation_date").order_by("-is_active")

    return render(request, "list-commissions.html", {
        "commissions": commissions,
        "active_commissions": True
    })


def view_commission(request, slug):
    com = get_object_or_404(Commission, slug=slug)
    event = None

    return render(request, "view_commission.html", {
        'com': com,
        'membre_inside': com.in_commission_membre(request),
        'can_manage': com.has_change_permission(request),
        'event': event
    })


def view_event(request, slug, eventslug):
    com = get_object_or_404(Commission, slug=slug)
    event = None

    try:
        event = Event.objects.get(slug=eventslug)

        assert event.commission.id == com.id, "Commission and event's commission doesn't match"

    except (Event.DoesNotExist, AssertionError):
        messages.add_message(request, messages.ERROR, "Événement {} non trouvé".format(eventslug))
        return redirect("/commissions/{}".format(com.slug))

    return render(request, "view_event.html", {
        'com': com,
        'event': event,
        'can_manage': event.has_change_event_permission(request)
    })

def commission_dashboard(request, slug):

    if not request.user.is_authenticated:
        return redirect("/login?next={}".format(request.path))

    com = get_object_or_404(Commission, slug=slug)

    if not com.has_change_permission(request):
        messages.add_message(request, messages.ERROR, "Tu ne peux pas acceder à cette commission, désolé...")
        return redirect("/commissions/{}".format(com.slug))

    upcoming_events = Event.objects.filter(event_date_end__gte=timezone.now(), commission=com).order_by("event_date_start")
    passed_events = Event.objects.filter(event_date_end__lt=timezone.now(), commission=com).order_by("event_date_start")

    return render(request, "dashboard_commission.html", {
        'com': com,
        "active_commission_id": com.id,
        "can_change_member": com.has_change_members_permission(request),
        "upcoming_events": upcoming_events,
        "passed_events": passed_events,
        'can_create_event': com.has_add_event_permission(request)
    })


def edit_commission(request, slug):

    if not request.user.is_authenticated:
        return redirect("/login?next={}".format(request.path))

    com = get_object_or_404(Commission, slug=slug)

    if not com.has_change_permission(request):
        messages.add_message(request, messages.ERROR, "Tu ne peux pas modifier cette commission, désolé...")
        return redirect("/commissions/{}".format(com.slug))

    edit_form = EditCommissionForm(request.POST or None, request.FILES or None, instance=com)

    # Put the queryset back on the form
    edit_form.fields["tags"].queryset = Tag.objects.all()

    if edit_form.is_valid():
        edit_form.save()
        messages.add_message(request, messages.SUCCESS, "Commission mise à jour")
        return redirect("/commissions/{}/manage/edit".format(com.slug))

    return render(request, "edit_commission.html", {
        'com': com,
        "edit_form": edit_form,
        "active_commission_id": com.id,
        "can_change_member": com.has_change_members_permission(request),
        "active_commission_edit": True
    })


def edit_members_commission(request, slug):
    if not request.user.is_authenticated:
        return redirect("/login?next={}".format(request.path))

    com = get_object_or_404(Commission, slug=slug)

    if not com.has_change_permission(request):
        messages.add_message(request, messages.ERROR, "Tu ne peux pas modifier cette commission, désolé...")
        return redirect("/commissions/{}".format(com.slug))

    if not com.has_change_members_permission(request):
        messages.add_message(request, messages.ERROR, "Tu ne peux pas modifier les membres de cette commission, désolé...")
        return redirect("/commissions/{}/manage".format(com.slug))

    form = EditCommissionMembersForm(request.POST or None, instance=com)
    form.fields["treasurer"].queryset = User.objects.all().filter(is_active=True)
    form.fields["deputy"].queryset = User.objects.all().filter(is_active=True).exclude(id=com.president.id)
    form.fields["president"].queryset = User.objects.all().filter(is_active=True)

    if form.is_valid():
        form.save()
        messages.add_message(request, messages.SUCCESS, "Membres de la commission modifiés")
        if com.has_change_members_permission(request):
            return redirect("/commissions/{}/manage/members".format(com.slug))
        elif com.has_change_permission(request):
            return redirect("/commissions/{}/manage".format(com.slug))
        else:
            return redirect("/commissions/{}".format(com.slug))

    return render(request, "edit_members_commission.html", {
        "com": com,
        "form": form,
        "active_commission_id": com.id,
        "active_commission_members": True,
        "can_change_member": True
    })


def create_commission(request):

    if not request.user.is_authenticated:
        return render(request, "create_commission_unauthenticated.html",{
            "active_commission_creation": True
        })

    if not request.user.has_perm("commissions.add_commission"):
        messages.add_message(request,messages.ERROR,"Tu n'es pas autorisé à créer une commission, désolé...")
        return redirect("/")

    if request.method == "POST":
        form = CreateCommissionForm(request.POST, request.FILES)

        if form.is_valid():

            commission = Commission()

            commission.name = form.cleaned_data["name"]
            commission.short_description = form.cleaned_data["short_description"]
            commission.logo = form.cleaned_data["logo"]
            commission.banner = form.cleaned_data["banner"]
            commission.description = form.cleaned_data["description"]

            commission.save()

            commission.tags.set(form.cleaned_data["tags"])

            if form.cleaned_data["treasurer"] is not None:
                commission.treasurer = form.cleaned_data["treasurer"]
            else:
                commission.treasurer = request.user

            commission.deputy = form.cleaned_data["substitute"]

            commission.president = request.user

            commission.save()

            messages.add_message(request, messages.SUCCESS, "Youhou ! Ta commission {} a bien été créée ! Amuse toi bien".format(commission.name))

            referers = User.objects.filter(support_member=True, is_active=True)

            if os.getenv("ENVIRONMENT", "production") == "production":
                access_addr = request.build_absolute_uri("/commissions/{}".format(commission.slug)).replace("http://", "https://")
            else:
                access_addr = request.build_absolute_uri("/commissions/{}".format(commission.slug))

            if os.getenv("ENVIRONMENT", "production") == "production":
                logo_addr = request.build_absolute_uri("/media/{}".format(commission.logo)).replace("http://", "https://")
            else:
                logo_addr = request.build_absolute_uri("/media/{}".format(commission.logo))

            for referer in referers:
                send_mail(
                    'Nouvelle commissions : {}'.format(commission.name),
                    "Une nouvelle commission nommée {} à été crée par {} !\n\n{}".format(
                        commission.name,
                        request.user.get_full_name(),
                        access_addr
                    ),
                    settings.DEFAULT_FROM_EMAIL,
                    [referer.email],
                    fail_silently=True,
                )
                logger.debug("Sent email of created commission to {}".format(referer.email))

            for webhook in Webhook.objects.filter(is_active=True, event="commission-create"):
                webhook.trigger(fail_silently=False, commission=commission, commission_url=access_addr, commission_logo_url=logo_addr)

            return redirect("/commissions/{}".format(commission.slug))
        else:
            messages.add_message(request, messages.ERROR, "Tu n'as pas correctement rempli le formulaire de creation")

    else:
        form = CreateCommissionForm(initial={
            'treasurer': request.user})

    return render(request, "create_commission.html", {
        'form': form,
        "active_commission_creation": True
    })

def action_membre(request, slug, action):
    if not request.user.is_authenticated:
        return redirect("/login?next={}".format(request.path))

    com = get_object_or_404(Commission, slug=slug)
    if action == 'add':
        if(com.is_possible_membre(request)) :
            membreCommission = MembreCommission()
            membreCommission.identification = request.user
            membreCommission.commission = com
            membreCommission.permission = ''
            membreCommission.save()
    elif action == 'remove' :
        if(com.in_commission_membre(request)) :
            MembreCommission.objects.filter(commission = com, identification = request.user).delete()
        
    return redirect("/commissions/{}".format(com.slug))

def add_edit_event(request, com_slug, slug=None):
    if not request.user.is_authenticated:
        return render(request, "create_commission_unauthenticated.html", {
            "active_commission_creation": True
        })

    com = get_object_or_404(Commission, slug=com_slug)

    if slug is not None:
        event = get_object_or_404(Event, slug=slug)

        if not event.has_change_event_permission(request):
            messages.add_message(request, messages.ERROR, "Tu n'es pas autorisé à modifier cet évènement, désolé...")
            return redirect("/commissions/{}/manage".format(com.slug))

    else:
        event = None

        if not com.has_add_event_permission(request):
            messages.add_message(request, messages.ERROR, "Tu n'es pas autorisé à créer un évènement, désolé...")
            return redirect("/commissions/{}/manage".format(com.slug))


    if request.method == "POST":
        form = EventForm(request.POST or None, request.FILES or None)
        if form.is_valid():
            new_event = False
            if event is None:
                event = Event()
                new_event = True
            event.name = form.cleaned_data["name"]
            event.event_date_start = form.cleaned_data["event_date_start"]
            event.event_date_end = form.cleaned_data["event_date_start"] + form.cleaned_data["event_duration"]
            event.description = form.cleaned_data["description"]
            event.banner = form.cleaned_data["banner"]
            event.location = form.cleaned_data["location"]
            event.commission = com
            event.save()

            if new_event:
                messages.add_message(request, messages.SUCCESS,
                                 "Youhou ! Ton évènement {} a bien été créée ! Amuse toi bien".format(form.cleaned_data['name']))
            else:
                messages.add_message(request, messages.SUCCESS,
                                 "Évènement {} mis à jour".format(form.cleaned_data['name']))

            return redirect("/commissions/{}/event-{}".format(event.commission.slug, event.slug))
        else:
            messages.add_message(request, messages.ERROR, "Tu n'as pas correctement rempli le formulaire de creation")

    else:
        if event is not None:
            initials = {
                'name': event.name,
                'event_date_start': event.event_date_start,
                'event_duration': event.event_date_end - event.event_date_start,
                'banner': event.banner,
                'description': event.description,
                'location': event.location
            }
        else:
            initials = None
        form = EventForm(initial=initials)

    return render(request, "edit_event.html", {
        'com': com,
        'event': event,
        'form': form
    })


def calendar(request):

    startDate = timezone.now() - timedelta(weeks=2)
    endDate = timezone.now() + timedelta(weeks=4)

    events = Event.objects.filter(event_date_end__gte=startDate, event_date_end__lte=endDate).order_by("event_date_start")

    if os.getenv("ENVIRONMENT", "production") == "production":
        base_addr = request.build_absolute_uri("/commissions").replace("http://", "https://")
    else:
        base_addr = request.build_absolute_uri("/commissions")

    return render(request, "calendar.ics", {
        "events": events,
        "base_addr": base_addr
    }, content_type="text/calendar")


def calendar_explain(request):
    return redirect("/guide/site/importer-le-calendrier")