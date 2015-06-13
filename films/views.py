from django.http import Http404
from .models import Film, FilmAgent
from django.shortcuts import render
from users.views import who_to_follow
from django.template import RequestContext


def profile(request, film_id):
    try:
        film = Film.objects.get(pk=film_id)
        all_film_agents = FilmAgent.objects.filter(film_id=film_id)
        actors = all_film_agents.filter(relation='actor')
        others = all_film_agents.exclude(relation='actor')
        related_films = Film.objects.filter(genre__icontains=film.genre).exclude(pk=film.id)
        posts = film.posts.all()
        top_films = Film.objects.order_by("-rate")
        return render(request, 'film_profile.html',
                      {'film': film, 'actors': actors, 'others': others,
                       'related_films': related_films, 'posts': posts,
                       'already_posted': posts.filter(author_id=request.user.id).exists(),
                       'top_films': top_films,
                       'users_follow': who_to_follow(request.user)},
                      context_instance=RequestContext(request))
    except Film.DoesNotExist:
        return Http404