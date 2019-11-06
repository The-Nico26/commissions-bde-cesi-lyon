import io

from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import permission_required
from django.http import HttpResponse
from django.shortcuts import render
import csv

from commissions.models import Commission


@staff_member_required
@permission_required("commission.view")
def export_commissions(request):

	commissions = Commission.objects.filter(is_active=True, is_organization=False).order_by("name")

	final_csv = io.StringIO()

	csv_writer = csv.writer(final_csv, delimiter=';')
	csv_writer.writerow(["Commission", "Organisation", "Président", "Trésorier", "Suppléant"])

	for com in commissions:
		data = [
			com.name,
			com.organization_dependant,
			com.president.email,
			com.treasurer.email if com.treasurer_id != com.president_id else "",
			com.deputy.email if com.deputy else ""
		]
		csv_writer.writerow(data)

	return HttpResponse(final_csv.getvalue(), content_type="text/csv")