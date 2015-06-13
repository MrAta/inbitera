from django.db import models
from films.models import Film
from users.models import CustomUser


class Post(models.Model):
    film = models.ForeignKey(Film, related_name='posts')
    author = models.ForeignKey(CustomUser, related_name='posts')
    text = models.TextField(max_length=500)
    rate = models.FloatField()
    pub_date = models.CharField(max_length=50)
    liked_users = models.ManyToManyField(CustomUser, related_name='liked_posts')