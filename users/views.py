import os

from datetime import datetime
from films.models import Film
from django.http import Http404
from django.contrib import auth
from django.conf import settings
from django.shortcuts import render
from .change_date import ChangeDate
from django.template import RequestContext
from .check_registration import CheckRegistration
from users.models import CustomUser, UserCover, UserImage
from django.contrib.auth.decorators import login_required
from notifications.models import Notification, set_notification
from django.http import HttpResponseForbidden, HttpResponse, HttpResponseRedirect


def login(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
        password = request.POST.get('password', None)
        user = auth.authenticate(email=email, password=password)
        if user:
            if user.is_active:
                auth.login(request, user)
                return HttpResponse('success')
            else:
                return HttpResponseForbidden('activation required')
        else:
            return HttpResponseForbidden('wrong email or pass')
    else:
        return HttpResponseForbidden('post required')


def create_username(first_name, last_name):
    last_num = CustomUser.objects.filter(first_name=first_name, last_name=last_name).count()
    last_num += 1
    username = first_name + '.' + last_name + '.' + str(last_num)
    return username


def register(request):
    if request.method == 'POST':
        errors = ''
        first_name = request.POST.get('first-name', None)
        last_name = request.POST.get('last-name', None)
        birth_date = request.POST.get('birth-date', None)
        password = request.POST.get('password', None)
        email = request.POST.get('email', None)
        errors += CheckRegistration.check_first_name(first_name)+' '
        errors += CheckRegistration.check_last_name(last_name)+' '
        errors += CheckRegistration.check_date(birth_date)+' '
        errors += CheckRegistration.check_pass(password)+' '
        errors += CheckRegistration.check_email(email)
        if not errors.strip():
            username = create_username(first_name, last_name)
            birth_date = birth_date.split('/')
            CustomUser.objects.create_user(username=username, first_name=first_name, last_name=last_name, email=email,
                                           password=password, birth_date=datetime(int(birth_date[0]),
                                                                                  int(birth_date[1]),
                                                                                  int(birth_date[2])))
            user = auth.authenticate(email=email, password=password)
            auth.login(request, user)
            return HttpResponse('success '+username)
        else:
            return HttpResponseForbidden(errors)
    else:
        return HttpResponseForbidden('post required')


@login_required
def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/')


def recover_email(request):
    if request.method == 'POST':
        email = request.POST.get('email', None)
    else:
        return HttpResponseForbidden()


def user_profile(request, username):
    try:
        owner = CustomUser.objects.get(username=username)
        same_user = owner == request.user
        following = False
        if request.user and request.user.is_authenticated() and not same_user:
            if request.user.following.filter(pk=owner.id).exists():
                following = True
        user_birth_date = owner.birth_date
        birth_year = user_birth_date.year
        birth_month = user_birth_date.month
        birth_day = user_birth_date.day
        top_films = Film.objects.order_by("-rate")[:5]
        return render(request, 'user_profile.html', {
            'owner': owner,
            'persian_birth_date': ChangeDate().change(year=birth_year, month=birth_month, day=birth_day),
            'same_user': same_user,
            'following': following,
            'followers': get_followers(owner.id),
            'users_follow': who_to_follow(request.user),
            'top_films': top_films
        }, context_instance=RequestContext(request))
    except CustomUser.DoesNotExist:
            raise Http404


def follow(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            try:
                user_id = request.POST.get('user-id', None)
                user = CustomUser.objects.get(pk=user_id)
                if user == request.user:
                    return HttpResponseForbidden('invalid follow')
                request.user.following.add(user)
                set_notification(from_user=request.user, to_user=user, post=None, comment=None, notification_type=4)
                return HttpResponse('success')
            except CustomUser.DoesNotExist:
                return HttpResponseForbidden('invalid username')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')


def un_follow(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            try:
                user_id = request.POST.get('user-id', None)
                user = CustomUser.objects.get(pk=user_id)
                if user == request.user:
                    return HttpResponseForbidden('invalid un follow')
                request.user.following.remove(user)
                Notification.objects.filter(from_user=request.user, to_user=user).delete()
                return HttpResponse('success')
            except CustomUser.DoesNotExist:
                return HttpResponseForbidden('invalid username')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')


def upload_pic(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            img_type = request.POST.get('type', None)
            if img_type == 'user_image':
                q_class = UserImage
                pic = request.FILES.get('user_image', None)
            else:
                q_class = UserCover
                pic = request.FILES.get('cover_pic', None)
            if pic:
                try:
                    old_pic = q_class.objects.get(custom_user__id=request.user.id)
                    if old_pic:
                        old_cover_path = os.path.join(settings.MEDIA_ROOT, str(old_pic.pic))
                        try:
                            os.remove(old_cover_path)
                        except OSError:
                            pass
                        old_pic.delete()
                except q_class.DoesNotExist:
                    pass
                new_pic = q_class(pic=pic, custom_user=request.user)
                new_pic.save()
                return HttpResponse('uploaded ' + os.path.join(settings.MEDIA_URL, str(new_pic.pic)))
            else:
                return HttpResponseForbidden('image required')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')


def get_followers(user_id):
    if user_id:
        followers = CustomUser.objects.filter(following__id=user_id)
        return followers


def edit_profile(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            field = request.POST.get('field', None)
            text = request.POST.get('text', None)
            if field == 'education':
                request.user.education = text
            elif field == 'living_place':
                request.user.place = text
            elif field == 'short-description':
                request.user.description = text
            elif field == 'user-job':
                request.user.job = text
            request.user.save()
            return HttpResponse('success')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')


def who_to_follow(target):
    to_follow = []
    if target.is_authenticated():
        following_users = target.following.all()
        for user in following_users:
            if len(to_follow) > 5:
                break
            for friend_follow in user.following.all():
                if len(to_follow) > 5:
                    break
                if friend_follow in following_users:
                    continue
                to_follow.append(friend_follow)
        all_users = CustomUser.objects.exclude(pk=target.id)
        for user in all_users:
            if len(to_follow) > 5:
                break
            if user in following_users:
                continue
            to_follow.append(user)
    return to_follow