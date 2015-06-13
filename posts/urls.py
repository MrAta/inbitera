from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^(?P<post_id>[0-9]+)/$', view),
    url(r'^add/$', add),
    url(r'^delete/$', delete),
    url(r'^update/$', update),
    url(r'^like/$', like),
    url(r'^unlike/$', unlike),
]
