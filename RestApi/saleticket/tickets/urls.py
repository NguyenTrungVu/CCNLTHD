from django.contrib import admin
from django.template.smartif import prefix
from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(prefix='routes', viewset=views.RouteViewSet, basename='route')
router.register(prefix='tours', viewset=views.TourViewSet, basename='tour')
router.register(prefix='tickets', viewset=views.TicketViewSet, basename='ticket')
router.register(prefix='users', viewset=views.UserViewSet, basename='user')
router.register(prefix='comments', viewset=views.CommentViewSet, basename='comment')
urlpatterns = [
    path('', include(router.urls)),
]