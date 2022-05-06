import http

from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from .models import Route, Tour, Ticket, Bus, User
from .serializers import (RouteSerializer,
                          TourSerializer,
                          TicketSerializer,
                          UserSerializer,
						DetailTicketSerializer,
)


from .paginators import TicketPaginator
from drf_yasg.utils import swagger_auto_schema


class RouteViewSet(viewsets.ViewSet, generics.ListAPIView):
	queryset = Route.objects.filter(active=True)
	serializer_class = RouteSerializer

	def get_queryset(self):
		r = self.queryset
		kw = self.request.query_params.get('kw')
		if kw:
			r = r.filter(name__icontains=kw)
		de_place = self.request.query_params.get('departed_place')
		if de_place:
			r = r.filter(departed_place=de_place)

		return r


class TourViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
	queryset = Tour.objects.filter(active=True)
	serializer_class = TourSerializer

	def get_queryset(self):
		t = self.queryset
		kw = self.request.query_params.get('kw')
		if kw:
			t = t.filter(subject__icontains=kw)
		de_time = self.request.query_params.get('departed_time')
		if de_time:
			t = t.filter(departed_time=de_time)
		k = self.request.query_params.get('k')
		if k:
			t = t.filter(route_id=k)

		return t

	@swagger_auto_schema(
		operation_description='Get the lessons of a course',
		responses={
			status.HTTP_200_OK: TicketSerializer()
		}
	)
	@action(methods=['get'], detail=True, url_path='tickets')
	def get_tickets(self, request, pk):

		tickets = Tour.objects.get(pk=pk).ticket.filter(active=True)

		kw = request.query_params.get('kw')
		if kw:
			tickets = tickets.filter(name__icontains=kw)

		return Response(data=TicketSerializer(tickets, many=True, context={'request': request}).data,
		                status=status.HTTP_200_OK)


class TicketViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
	queryset = Ticket.objects.filter(active=True)
	serializer_class = DetailTicketSerializer


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
	queryset = User.objects.filter(is_active=True)
	serializer_class = UserSerializer

	def get_permissions(self):
		if self.action == 'current_user':
			return [permissions.IsAuthenticated()]

		return [permissions.AllowAny()]

	@action(methods=['get'], url_path="current-user", detail=False)
	def current_user(self, request):
	    return Response(self.serializer_class(request.user, context={'request': request}).data,
	                    status=status.HTTP_200_OK)


def index(request):
	return HttpResponse("hello")
# Create your views here.
