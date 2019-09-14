from commissions.models import Commission


def availableCommissions(request):
    allCommissions = Commission.objects.order_by("name")
    commissions = []
    for com in allCommissions:
        if com.has_change_permission(request):
            commissions.append(com)
    return {
        'userCommissions': commissions
    }
