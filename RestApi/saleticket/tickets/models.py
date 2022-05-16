from abc import abstractproperty

from django.contrib.auth.models import AbstractUser
from django.db import models
from ckeditor.fields import RichTextField


class User(AbstractUser):
	avatar = models.ImageField(null=False, upload_to='users/%Y/%m')


class ModelBase(models.Model):
	active = models.BooleanField(default=True)
	created_date = models.DateTimeField(auto_now_add=True)
	updated_date = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


class Route(ModelBase):
	subject = models.CharField(max_length=50, unique=True)
	departed_place = models.CharField(max_length=50, null=False)
	arrived_place = models.CharField(max_length=50, null=False)
	distance = models.CharField(max_length=50, null=False)
	time_duration = models.CharField(max_length=50, null=False)
	image = models.ImageField(null=True, blank=True, upload_to='routes/%Y/%m')

	def __str__(self):
		return self.subject


class Tour(ModelBase):
	subject = models.CharField(max_length=50, null=False)
	departed_date = models.DateField(max_length=50, null=False)
	departed_time = models.TimeField(max_length=30, null=False)
	arrived_time = models.TimeField(max_length=30, null=True, blank=True)
	price = models.DecimalField(default=0, null=False, max_digits=20, decimal_places=1)
	route = models.ForeignKey(Route, related_name='tour', related_query_name='my_tour', on_delete=models.CASCADE)
	user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)

	def __str__(self):
		return self.subject

	class Meta:
		unique_together = ('subject', 'route')


class Category(ModelBase):
	subject = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return self.subject


class Bus(ModelBase):
	license_plates = models.CharField(max_length=20, unique=True)
	seat_total = models.IntegerField(null=False, default=30)
	kind_bus = models.ForeignKey(Category, null=True, related_name='kind', related_query_name='kind_bus', on_delete=models.SET_NULL)


class Ticket(ModelBase):
	name = models.CharField(max_length=50, unique=True)
	tour = models.ForeignKey(Tour, blank=False, related_name='ticket', related_query_name='my_ticket', on_delete=models.CASCADE)
	passenger = models.ForeignKey(User, blank=False, on_delete=models.CASCADE)
	bus = models.ForeignKey(Bus, blank=False, on_delete=models.CASCADE)
	tags = models.ManyToManyField('Tag', blank=True, related_name='ticket')
	description = models.CharField(max_length=255, null=True)
	seat_position = models.CharField(max_length=50, null=True)

	def __str__(self):
		return self.name


class DetailTour(ModelBase):
	description = models.CharField(max_length=255, null=True)
	empty_seat = models.IntegerField(null=True)
	booked_seat = models.IntegerField(null=True)
	tour = models.ForeignKey(Tour, related_name='detail_tour', blank=False, on_delete=models.CASCADE)
	# user = models.ForeignKey(User, null=False, on_delete=models.CASCADE)


class Tag(models.Model):
	name = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return self.name


class Comment(ModelBase):
	content = models.TextField()
	tour = models.ForeignKey(Tour, related_name='comments', on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)

	def __str__(self):
		return self.content
# Create your models here.
