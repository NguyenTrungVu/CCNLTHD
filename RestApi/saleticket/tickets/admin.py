from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse
from django.utils.html import mark_safe

from .models import Route, Tour, User, Bus, Category, Tag, Ticket, DetailTour
from django.urls import path


class TourAdmin(admin.ModelAdmin):
	list_display = ["id", "active", "subject", "departed_date", "departed_time", "price", ]
	list_filter = ["subject", "departed_date", "price"]
	search_fields = ["subject"]


class TourInline(admin.StackedInline):
	model = Tour
	pk_name = 'route'


class RouteAdmin(admin.ModelAdmin):
	inlines = [TourInline, ]
	search_fields = ["subject"]
	readonly_fields = ['avatar']

	def avatar(self, obj):
		if obj:
			return mark_safe('<img src="/static/{url}" width="120" />'.format(url=obj.image.name))


class BusAdmin(admin.ModelAdmin):
	list_display = ["id", "active", "license_plates", "seat_total", "kind_bus"]
	list_filter = ["seat_total", "kind_bus"]
	search_fields = ["license_plates", "kind_bus"]


class BusInline(admin.StackedInline):
	model = Bus
	pk_name = 'kind_bus'


class TicketTagInlineAdmin(admin.TabularInline):
	model = Ticket.tags.through


class TagAdmin(admin.ModelAdmin):
	inlines = [TicketTagInlineAdmin, ]


class CategoryAdmin(admin.ModelAdmin):
	inlines = [BusInline, ]


class TicketsAdmin(admin.ModelAdmin):
	list_display = ["id", "active", "tour", "passenger", "bus", "seat_position"]


class DetailTourAdmin(admin.ModelAdmin):
	list_display = ["id", "active", "empty_seat", "booked_seat", "tour"]


class TicketAdminSite(admin.AdminSite):
	site_header = 'HỆ THỐNG QUẢN LÝ VÉ XE'

	def get_urls(self):
		return [
			path('tour-stats/', self.tour_stats)
		] + super().get_urls()

	def tour_stats(self, request):
		tour_count = Route.objects.filter(active=True).count()
		stats = Route.objects.annotate(tour_count=Count('my_tour')).values('id', 'name', 'tour_count')
		return TemplateResponse(request, 'admin/ticket-stats.html', {
			'tour_count': tour_count,
			'tour_stats': stats
		})


admin_site = TicketAdminSite(name='myadmin')
# Register your models here.
admin_site.register(Route, RouteAdmin)
admin_site.register(Tour, TourAdmin)
admin_site.register(User)
admin_site.register(Bus, BusAdmin)
admin_site.register(Category, CategoryAdmin)
admin_site.register(Tag)
admin_site.register(Ticket, TicketsAdmin)
admin_site.register(DetailTour, DetailTourAdmin)