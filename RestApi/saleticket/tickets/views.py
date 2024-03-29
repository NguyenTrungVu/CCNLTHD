import http

from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.views import APIView

from .models import Route, Tour, Ticket, Bus, User, Comment, Place
from .serializers import (RouteSerializer,
                          TourSerializer,
                          TicketSerializer,
                          UserSerializer,
                          CreateCommentSerializer, CommentSerializer,
						  DetailTourSerializer, PlaceSerializer
                          )

from .paginators import TicketPaginator
from drf_yasg.utils import swagger_auto_schema
from .perms import CommentOwnerPerms
from django.conf import settings


class RouteViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
	queryset = Route.objects.filter(active=True)
	serializer_class = RouteSerializer

	def get_queryset(self):
		r = self.queryset
		kw = self.request.query_params.get('kw')
		if kw:
			r = r.filter(departed_place__icontains=kw)

		pk = self.request.query_params.get("pk")
		if pk:
			r = r.filter(id=pk)
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
			t = t.filter(departed_date=de_time)
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

	def get_permissions(self):
		if self.action == 'add_comments':
			return [permissions.IsAuthenticated()]

		return [permissions.AllowAny()]

	@action(methods=['post'], url_path='add-comments', detail=True)
	def add_comments(self, request, pk):
		content = request.data.get('content')
		if content:
			c = Comment.objects.create(content=content, user=request.user, tour=self.get_object())
			return Response(CreateCommentSerializer(c).data, status=status.HTTP_201_CREATED)

		return Response(status=status.HTTP_400_BAD_REQUEST)

	@action(methods=['get'], url_path='comments', detail=True)
	def get_comments(self, request, pk):
		tour = self.get_object()
		comments = tour.comments.select_related('user').filter(active=True)
		comments = Comment.objects.order_by('-id')
		return Response(CommentSerializer(comments, many=True, context={'request': request}).data,
		                status=status.HTTP_200_OK)

	@action(methods=['get'], url_path='tour-detail', detail=True)
	def get_tour_detail(self, request, pk):
		tour_detail = Tour.objects.get(pk=pk).detail_tour.filter(active=True)

		return Response(DetailTourSerializer(tour_detail, many=True).data, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ViewSet,
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


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
	queryset = User.objects.filter(is_active=True)
	serializer_class = UserSerializer

	def get_permissions(self):
		if self.action == 'get_current_user':
			return [permissions.IsAuthenticated()]

		return [permissions.AllowAny()]

	@action(methods=['get'], url_path="current-user", detail=False)
	def get_current_user(self, request):
		return Response(self.serializer_class(request.user, context={'request': request}).data,
		                status=status.HTTP_200_OK)


# class AuthInfo(APIView):
# 	def get(self):
# 		return Response(se)
class PlaceViewSet(viewsets.ViewSet, generics.ListAPIView):
	queryset = Place.objects.filter(active=True)
	serializer_class = PlaceSerializer

	def get_queryset(self):
		r = self.queryset
		return r

def index(request):
	return HttpResponse("hello")
# Create your views here.
