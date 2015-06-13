from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^add/$', add),
    url(r'^delete/$', delete),
    url(r'^update/$', update),
    url(r'^like/$', like),
    url(r'^unlike/$', unlike),
]