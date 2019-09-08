import random

from django.shortcuts import render

from commissions.models import Commission
from commissions.models import Tag


def index(request):

    commissions = Commission.objects.order_by("-creation_date")

    # Get the 5 latest commissions created
    latest_commissions = commissions[:5]
    random_commissions = random.sample(list(commissions), min(5, len(commissions)))

    return render(request, "index.html", {
        "latest_commissions": latest_commissions,
        "random_commissions": random_commissions,
        "commission_count": commissions.count()
    })



