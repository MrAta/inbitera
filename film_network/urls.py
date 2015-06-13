from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^(?:index/)?$', home),
    url(r'^time-line/$', entry_index),
]

