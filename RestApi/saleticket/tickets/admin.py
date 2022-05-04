from django.contrib import admin
from .models import Route, Tour, User, Bus, Category, Tag


class TourAdmin(admin.ModelAdmin):
	list_display = ["id", "active", "subject", "departed_date", "departed_time", "price", ]
	list_filter = ["subject", "departed_date", "price"]
	search_fields = ["subject"]


class TourInline(admin.StackedInline):
	model = Tour
	pk_name = 'route'


class RouteAdmin(admin.ModelAdmin):
	inlines = [TourInline, ]


class BusAdmin(admin.ModelAdmin):
	list_display = ["id", "active", "license_plates", "seat_total", "kind_bus"]
	list_filter = ["seat_total", "kind_bus"]
	search_fields = ["license_plates", "kind_bus"]


class BusInline(admin.StackedInline):
	model = Bus
	pk_name = 'kind_bus'


class BusTagInlineAdmin(admin.TabularInline):
	model = Bus.tags.through


class TagAdmin(admin.ModelAdmin):
	inlines = [BusTagInlineAdmin, ]


class CategoryAdmin(admin.ModelAdmin):
	inlines = [BusInline, ]


# Register your models here.
admin.site.register(Route, RouteAdmin)
admin.site.register(Tour, TourAdmin)
admin.site.register(User)
admin.site.register(Bus, BusAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag)
