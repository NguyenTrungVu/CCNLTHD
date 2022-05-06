from rest_framework import pagination


class TicketPaginator(pagination.PageNumberPagination):
    page_size = 2
