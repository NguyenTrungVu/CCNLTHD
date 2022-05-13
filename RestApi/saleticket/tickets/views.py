import http

from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from .models import Route, Tour, Ticket, Bus, User, Comment
from .serializers import (RouteSerializer,
                          TourSerializer,
                          TicketSerializer,
                          UserSerializer,
                          DetailTicketSerializer, CreateCommentSerializer, CommentSerializer,
                          )

from .paginators import TicketPaginator
from drf_yasg.utils import swagger_auto_schema
from .perms import CommentOwnerPerms


class RouteViewSet(viewsets.ViewSet, generics.ListAPIView):
	queryset = Route.objects.filter(active=True)
	serializer_class = RouteSerializer

	def get_queryset(self):
		r = self.queryset
		kw = self.request.query_params.get('kw')
		if kw:
			r = r.filter(departed_place__icontains=kw)

		return r

	@swagger_auto_schema(
		operation_description='Get the lessons of a course',
		responses={
			status.HTTP_200_OK: TicketSerializer()
		}
	)
	@action(methods=['get'], detail=True, url_path='tours')
	def get_tour(self, request, pk):
		route = self.get_object()
		tours = route.tour.filter(active=True)
		# tours = Route.objects.get(pk=pk).tour.filter(active=True)

		kw = request.query_params.get('kw')
		if kw:
			tours = tours.filter(subject__icontains=kw)

		return Response(data=TourSerializer(tours, many=True, context={'request': request}).data,
		                status=status.HTTP_200_OK)


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

	@action(methods=['get'], url_path='comments', detail=True)
	def get_comments(self, request, pk):
		tour = self.get_object()
		comments = tour.comments.select_related('user').filter(active=True)

		return Response(CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ViewSet, generics.CreateAPIView,
                     generics.UpdateAPIView, generics.DestroyAPIView):
	queryset = Comment.objects.filter(active=True)
	serializer_class = CreateCommentSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_permissions(self):
		if self.action in ['update', 'destroy']:
			return [CommentOwnerPerms()]

		return [permissions.IsAuthenticated()]


class TicketViewSet(viewsets.ViewSet, generics.CreateAPIView):
	queryset = Ticket.objects.filter(active=True)
	serializer_class = TicketSerializer


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
