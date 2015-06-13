from django.conf.urls import url
from .views import *

urlpatterns = [
    url(r'^login/$', login),
    url(r'^logout/$', logout),
    url(r'^register/$', register),
    url(r'^recover/$', recover_email),
    url(r'^follow/$', follow),
    url(r'^unfollow/$', un_follow),
    url(r'^upload-pic/$', upload_pic),
    url(r'^edit-profile/$', edit_profile),
    url('^([A-Za-z0-9-@+_\u0600-\u06FF]+[.][A-Za-z0-9-@+_\u0600-\u06FF]+[.][0-9]+)/$', user_profile),
]