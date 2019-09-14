from django.shortcuts import render, get_object_or_404

from commissions.models import Commission


def list_commissions(request):

    commissions = Commission.objects.order_by("-creation_date")

    return render(request, "list-commissions.html", {
        "commissions": commissions
    })


def view_commission(request, slug):
    com = get_object_or_404(Commission, slug=slug)

    return render(request, "view_commission.html", {
        'com': com
    })


def create_commission(request):

    if not request.user.is_authenticated:
        return render(request, "create_commission_unauthenticated.html")

    return render(request, "create_commission.html")
