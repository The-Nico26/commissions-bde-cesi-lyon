from commissions.models import Commission
from documents.models import Document
from users.models import User


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

    statusBdsQS = Document.objects.order_by("-created_at").filter(role="status-bds", current_version=True)
    if statusBdsQS.count() > 0:
        current_status_bds = statusBdsQS[0]
    else:
        current_status_bds = None

    rulesBdsQS = Document.objects.order_by("-created_at").filter(role="reglement-interieur-bds", current_version=True)
    if rulesBdsQS.count() > 0:
        current_rules_bds = rulesBdsQS[0]
    else:
        current_rules_bds = None


    return {
        'status_doc': current_status,
        'rules_doc': current_rules,
        'status_bds_doc': current_status_bds,
        'rules_bds_doc': current_rules_bds,
    }


def supportTeam(request):

    support = User.objects.filter(support_member=True).exclude(id=request.user.id)

    return {
        'support_team': support,
    }

