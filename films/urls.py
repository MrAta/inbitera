from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^(?P<film_id>[0-9]+)/$', profile, name='profile'),
]
