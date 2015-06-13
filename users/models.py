from django.db import models
from django.contrib.auth.models import User, UserManager


class CustomUser(User):
    following = models.ManyToManyField('self', symmetrical=False)

    # characteristics
    birth_date = models.DateField()
    place = models.CharField(max_length=50)
    description = models.TextField(max_length=300)
    job = models.CharField(max_length=50)
    education = models.CharField(max_length=50)

    objects = UserManager()


class UserCover(models.Model):
    pic = models.ImageField(upload_to='users/covers/')
    custom_user = models.OneToOneField(CustomUser, related_name='user_cover')


class UserImage(models.Model):
    pic = models.ImageField(upload_to='users/user_images/')
    custom_user = models.OneToOneField(CustomUser, related_name='user_image')