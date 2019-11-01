import random

from django.shortcuts import render

from commissions.models import Commission
from commissions.models import Tag
from commissions.models import Event

import datetime


def index(request):

    upcoming_events = Event.objects.filter(event_date_end__gte=datetime.datetime.now()).order_by("event_date_start")

    commissions = Commission.objects.order_by("-creation_date").filter(is_active=True)

    # Get the 5 latest commissions created
    latest_commissions = commissions[:5]
    random_commissions = random.sample(list(commissions), min(5, len(commissions)))

    return render(request, "index.html", {
        "latest_commissions": latest_commissions,
        "random_commissions": random_commissions,
        "commission_count": commissions.count(),
        "upcoming_events": upcoming_events
    })



