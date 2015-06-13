from django.db import models
from posts.models import Post
from users.change_date import ChangeDate
from users.models import CustomUser
from comments.models import Comment
from django.utils.timezone import now


class Notification(models.Model):
    from_user = models.ForeignKey(CustomUser, related_name='sent_notifications')
    to_user = models.ForeignKey(CustomUser, related_name='received_notifications')
    post = models.ForeignKey(Post, related_name='notifications', null=True)
    comment = models.ForeignKey(Comment, null=True)
    date = models.CharField(max_length=50)
    type = models.IntegerField()


def set_notification(from_user, to_user, post, comment, notification_type):
    date = ChangeDate().get_persian_date_time(now())
    notification = Notification(from_user=from_user, to_user=to_user, post=post,
                                comment=comment, type=notification_type, date=date)
    notification.save()