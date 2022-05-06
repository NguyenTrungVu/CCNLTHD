from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(prefix='routes', viewset=views.RouteViewSet, basename='route')
router.register(prefix='tours', viewset=views.TourViewSet, basename='tour')
router.register(prefix='tickets', viewset=views.TicketViewSet, basename='ticket')

urlpatterns = [
    path('', include(router.urls)),

]