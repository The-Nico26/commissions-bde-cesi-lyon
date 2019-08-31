from django.shortcuts import render

from commissions.models import Commission


def list_commissions(request):

    commissions = Commission.objects.order_by("-creation_date")

    return render(request, "list-commissions.html", {
        "commissions": commissions
    })
