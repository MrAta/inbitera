from django.conf.urls import include, url
from django.contrib import admin
from django.conf import settings

urlpatterns = [

    # Comments urls

    url(r'^comment/', include('comments.urls')),

    # Film_network urls

    url(r'', include('film_network.urls')),

    # Films urls

    url(r'^film/', include('films.urls')),

    # Notifications urls

    url(r'^notification/', include('notifications.urls')),

    # Posts urls

    url(r'^post/', include('posts.urls')),

    # Search urls

    url(r'^search/', include('search.urls')),

    # Users urls

    url(r'^user/', include('users.urls')),

    # Other urls

    url(r'^admin/', include(admin.site.urls)),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),

]