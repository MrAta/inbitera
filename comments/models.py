from django.db import models
from posts.models import Post
from users.models import CustomUser


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments')
    author = models.ForeignKey(CustomUser, related_name='comments')
    text = models.TextField(max_length=500)
    pub_date = models.CharField(max_length=50)
    liked_users = models.ManyToManyField(CustomUser, related_name='liked_comments')