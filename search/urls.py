from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^film(\\?[A-Za-z0-9-@+_\u0600-\u06FF]+[.][A-Za-z0-9-@+_\u0600-\u06FF]+[.][0-9]+)?$', films),
    url(r'^user(\\?[A-Za-z0-9-@+_\u0600-\u06FF]+[.][A-Za-z0-9-@+_\u0600-\u06FF]+[.][0-9]+)?$', users),
]
