
from rest_framework import serializers
from .models import Route, Tour, Bus, DetailTour, Ticket, User, Comment, Tag, Place


class RouteSerializer(serializers.ModelSerializer):
	image = serializers.SerializerMethodField(source='image')

	def get_image(self, obj):
		request = self.context['request']
		path = '/static/%s' % obj.image.name

		return request.build_absolute_uri(path)

	class Meta:
		model = Route
		fields = "__all__"


class TourSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tour
		fields = ['id', 'subject', 'departed_date', 'departed_time', 'price', 'route']


# class CategorySerializer(serializers.ModelSerializer):
# 	class Meta:
# 		model = Category
# 		fields = "__all__"


class DetailTourSerializer(serializers.ModelSerializer):
	class Meta:
		model = DetailTour
		fields = ["description", "empty_seat", "booked_seat", "tour"]


class TagSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tag
		fields = "__all__"


class TicketSerializer(serializers.ModelSerializer):
	class Meta:
		model = Ticket
		fields = ['id', 'tour', 'passenger', 'bus', 'seat_position', 'description']


class UserSerializer(serializers.ModelSerializer):
	avatar = serializers.SerializerMethodField(source='avatar')

	def get_avatar(self, obj):
		request = self.context['request']
		if obj.avatar and not obj.avatar.name.startswith("/static"):
			path = '/static/%s' % obj.avatar.name

			return request.build_absolute_uri(path)

	class Meta:
		model = User
		fields = ['first_name', 'last_name',
		          'username', 'password', 'email',
		          'avatar']
		extra_kwargs = {
			'password': {
				'write_only': True
			}
		}

	def create(self, validated_data):
		data = validated_data.copy()
		user = User(**data)
		user.set_password(user.password)
		user.save()

		return user


class CreateCommentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Comment
		fields = ['content', 'user', 'tour']


class CommentSerializer(serializers.ModelSerializer):
	user = UserSerializer()

	class Meta:
		model = Comment
		exclude = ['active']


class PlaceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Place
		fields = "__all__"
