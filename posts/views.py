from .models import Post
from films.models import Film
from django.shortcuts import render
from django.db import IntegrityError
from django.utils.timezone import now
from users.views import who_to_follow
from users.change_date import ChangeDate
from django.template import RequestContext
from django.http import HttpResponseForbidden, HttpResponse, Http404
from notifications.models import set_notification, Notification


def view(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
        top_films = Film.objects.all().order_by('-rate')[:5]
        return render(request, 'post_view.html', {'posts': [post],
                                                  'top_films': top_films,
                                                  'users_follow': who_to_follow(request.user)},
                      context_instance=RequestContext(request))
    except Post.DoesNotExist:
        return Http404


def add(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            film_id = request.POST.get('film-id', None)
            rate = request.POST.get('rate', None)
            text = request.POST.get('text', None)
            if film_id and rate and text:
                if request.user.posts.all().filter(film_id=film_id).exists():
                        return HttpResponseForbidden('already posted')
                try:
                    film = Film.objects.get(pk=film_id)
                    post_number = film.posts.all().count()
                    res = float(film.rate)*post_number+float(rate)
                    film.rate = res/(post_number+1)
                    film.save()
                    pub_date = ChangeDate().get_persian_date_time(now())
                    post = Post(film_id=film_id, author=request.user, text=text, rate=str(rate), pub_date=pub_date)
                    post.save()
                    return HttpResponse('success/' + str(post.id) + '/' + pub_date)
                except ValueError or IntegrityError or Film.DoesNotExist:
                    return HttpResponseForbidden('error')
            else:
                return HttpResponseForbidden('incomplete data')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')


def delete(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            post_id = request.POST.get('post-id', None)
            if post_id:
                try:
                    post = request.user.posts.all().get(pk=post_id)
                    film = Film.objects.get(pk=post.film.id)
                    post_number = film.posts.all().count()
                    res = float(film.rate)*post_number-float(post.rate)
                    if res == 0:
                        film.rate = 0
                    else:
                        film.rate = res/(post_number-1)
                    film.save()
                    post.delete()
                    return HttpResponse('success')
                except Post.DoesNotExist or Film.DoesNotExist:
                    return HttpResponseForbidden('invalid post-id')
            else:
                return HttpResponseForbidden('post-id required')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')


def update(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            post_id = request.POST.get('post-id', None)
            text = request.POST.get('text', None)
            if post_id and text:
                try:
                    post = request.user.posts.all().get(pk=post_id)
                    post.text = text
                    post.save()
                    return HttpResponse('success')
                except Post.DoesNotExist:
                    return HttpResponseForbidden('invalid data')
            else:
                return HttpResponseForbidden('incomplete data')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')


def like(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            post_id = request.POST.get('post-id', None)
            if post_id:
                try:
                    post = Post.objects.get(id=post_id)
                    post.liked_users.add(request.user)
                    post.save()
                    set_notification(from_user=request.user, to_user=post.author,
                                     post=post, comment=None, notification_type=3)
                    return HttpResponse('success')
                except Post.DoesNotExist:
                    return HttpResponseForbidden('invalid post-id')
            else:
                return HttpResponseForbidden('post-id required')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')


def unlike(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            post_id = request.POST.get('post-id', None)
            if post_id:
                try:
                    post = Post.objects.get(id=post_id)
                    post.liked_users.remove(request.user.id)
                    post.save()
                    Notification.objects.filter(from_user=request.user, post_id=post_id).delete()
                    return HttpResponse('success')
                except Post.DoesNotExist:
                    return HttpResponseForbidden('invalid post-id')
            else:
                return HttpResponseForbidden('post-id required')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')