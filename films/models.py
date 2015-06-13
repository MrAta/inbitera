from django.db import models


class Agent(models.Model):
    name = models.CharField(max_length=50)
    pic = models.ImageField(upload_to='films/agents/%Y/%m/%d')
    imdb_link = models.URLField(default='http://en.wikipedia.org/wiki/')
    short_description = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Film(models.Model):
    name = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    country = models.CharField(max_length=50)
    duration = models.PositiveIntegerField(default=0)
    genre = models.CharField(max_length=150)
    synopsis = models.TextField(max_length=700)
    review = models.TextField(max_length=700)
    language = models.CharField(max_length=50)
    rate = models.FloatField(default=0)
    pic = models.ImageField(upload_to='films/pics/%Y/%m/%d')
    cover = models.ImageField(upload_to='films/covers/%Y/%m/%d')
    imdb_link = models.URLField(default='http://en.wikipedia.org/wiki/')
    director = models.ForeignKey(Agent, related_name='directed_films')
    writers = models.ManyToManyField(Agent, related_name='written_films')
    agents = models.ManyToManyField(Agent, through='FilmAgent')

    def __str__(self):
        return self.name


class FilmAgent(models.Model):
    agent = models.ForeignKey(Agent, related_name='films')
    film = models.ForeignKey(Film)
    relation = models.CharField(max_length=50)
    role = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.agent.name+('-'+self.role if self.role else '')+'-'+self.film.name