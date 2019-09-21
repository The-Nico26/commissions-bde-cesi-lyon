from commissions.models import Commission
from documents.models import Document


def availableCommissions(request):
    allCommissions = Commission.objects.order_by("name")
    commissions = []
    for com in allCommissions:
        if com.has_change_permission(request):
            commissions.append(com)
    return {
        'userCommissions': commissions
    }


def currentDocuments(request):

    statusQS = Document.objects.order_by("-created_at").filter(role="status", current_version=True)
    if statusQS.count() > 0:
        current_status = statusQS[0]
    else:
        current_status = None

    rulesQS = Document.objects.order_by("-created_at").filter(role="reglement-interieur", current_version=True)
    if rulesQS.count() > 0:
        current_rules = rulesQS[0]
    else:
        current_rules = None

    return {
        'status_doc': current_status,
        'rules_doc': current_rules,
    }

