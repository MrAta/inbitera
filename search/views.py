import json

from films.models import Film
from django.db.models import Q
from django.shortcuts import render
from django.template import RequestContext
from users.models import CustomUser, UserImage
from django.http import HttpResponseForbidden, HttpResponse


def films(request, q):
    if request.method == 'POST':
        query = request.POST.get('q', None)
        if query:
            result = Film.objects.filter(Q(name__icontains=query) | Q(synopsis__icontains=query))[:5]
            res_list = []
            for film in result:
                res_list.append({'id': film.id, 'pic': film.pic.url, 'name': film.name, 'director': film.director.name,
                                 'country': film.country, 'year': film.year})
            list_json = json.dumps(res_list)
            return HttpResponse(list_json)
            # return HttpResponse(serializers.serialize("json", result, fields=('name', 'year', 'director')))
        else:
            return HttpResponse('incomplete data')
    else:
        query = q
        if query:
            result = Film.objects.filter(Q(name__icontains=query) | Q(synopsis__icontains=query))
        else:
            result = Film.objects.all()
        return render(request, 'search_result.html', {'films': result}, context_instance=RequestContext(request))


def users(request, q):
    if request.method == 'POST':
        query = request.POST.get('q', None)
        if query:
            result = []
            for user in CustomUser.objects.all():
                if len(result) > 5:
                    break
                full_name = user.first_name + ' ' + user.last_name
                if query in full_name:
                    try:
                        pic = user.user_image.pic.url
                    except UserImage.DoesNotExist:
                        pic = ''
                    result.append({'pic': pic, 'name': user.first_name+' '+user.last_name, 'username': user.username,
                                   'job': user.job, 'place': user.place, 'education': user.education})
            list_json = json.dumps(result)
            return HttpResponse(list_json)
            # return HttpResponse(serializers.serialize("json", result))
        else:
            return HttpResponseForbidden('incomplete data')
    else:
        query = q
        if query:
            result = []
            for user in CustomUser.objects.all():
                full_name = user.first_name + ' ' + user.last_name
                if query in full_name:
                    result.append(user)
        else:
            result = CustomUser.objects.all()
        return render(request, 'search_result.html', {'users': result}, context_instance=RequestContext(request))