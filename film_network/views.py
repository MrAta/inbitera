from django.shortcuts import render
from posts.models import Post
from films.models import Film
from users.views import who_to_follow
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required


def home(request):
    new_films = Film.objects.order_by("-id")
    return render(request, 'index.html', {'films': new_films}, context_instance=RequestContext(request))


@login_required
def entry_index(request):
    posts = []
    users = request.user.following.all()
    for user in users:
        posts += Post.objects.filter(author=user)
    top_films = Film.objects.order_by("-rate")
    if request.user.is_authenticated():
        return render(request, 'time_line.html', {'posts': posts, 'top_films': top_films,
                                                  'users_follow': who_to_follow(request.user)},
                      context_instance=RequestContext(request))
    else:
        return HttpResponseRedirect('/')