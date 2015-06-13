from .models import Comment
from posts.models import Post
from django.db import IntegrityError
from django.utils.timezone import now
from users.change_date import ChangeDate
from django.http import HttpResponseForbidden, HttpResponse
from notifications.models import set_notification, Notification


def add(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            post_id = request.POST.get('post-id', None)
            text = request.POST.get('text', None)
            if post_id and text:
                try:
                    pub_date = ChangeDate().get_persian_date_time(now())
                    new_comment = Comment(post_id=post_id, author=request.user, text=text, pub_date=pub_date)
                    new_comment.save()
                    post = Post.objects.get(id=post_id)
                    set_notification(from_user=request.user, to_user=post.author,
                                     post=post, comment=new_comment, notification_type=1)
                    return HttpResponse('success/' + str(new_comment.id) + '/' + pub_date)
                except IntegrityError:
                    return HttpResponseForbidden('integrity error')
            else:
                return HttpResponseForbidden('invalid data')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')


def delete(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            comment_id = request.POST.get('comment-id', None)
            if comment_id:
                try:
                    comment = request.user.comments.all().get(pk=comment_id)
                    Notification.objects.filter(from_user=request.user, comment_id=comment_id).delete()
                    comment.delete()
                    return HttpResponse('success')
                except Comment.DoesNotExist:
                    return HttpResponseForbidden('invalid data')
            else:
                return HttpResponseForbidden('comment_id required')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')


def update(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            comment_id = request.POST.get('comment-id', None)
            text = request.POST.get('text', None)
            if comment_id and text:
                try:
                    comment = request.user.comments.all().get(pk=comment_id)
                    comment.text = text
                    comment.save()
                    return HttpResponse('success')
                except Comment.DoesNotExist:
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
            comment_id = request.POST.get('comment-id', None)
            if comment_id:
                try:
                    comment = Comment.objects.get(pk=comment_id)
                    comment.liked_users.add(request.user)
                    comment.save()
                    set_notification(from_user=request.user, to_user=comment.author,
                                     post=comment.post, comment=comment, notification_type=2)
                    return HttpResponse('success')
                except Comment.DoesNotExist:
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
            comment_id = request.POST.get('comment-id', None)
            if comment_id:
                try:
                    comment = Comment.objects.get(id=comment_id)
                    comment.liked_users.remove(request.user.id)
                    comment.save()
                    Notification.objects.filter(from_user=request.user, comment_id=comment_id).delete()
                    return HttpResponse('success')
                except Comment.DoesNotExist:
                    return HttpResponseForbidden('invalid comment-id')
            else:
                return HttpResponseForbidden('post-id required')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')