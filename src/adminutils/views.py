from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import permission_required
from django.shortcuts import render

from commissions.models import Commission


@staff_member_required
@permission_required("commission.view")
def export_commissions(request):

	commissions = Commission.objects.filter(is_active=True, is_organization=False).order_by("name")

	return render(request, "export_commissions.csv", {
		'commissions': commissions
	}, content_type="text/csv")