from notifications.models import Notification
from django.http import HttpResponse, HttpResponseForbidden


def delete(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            notification_id = request.POST.get('notification-id', None)
            try:
                Notification.objects.get(pk=notification_id).delete()
                return HttpResponse('success')
            except Notification.DoesNotExist:
                return HttpResponseForbidden('invalid data')
        else:
            return HttpResponseForbidden('post required')
    else:
        return HttpResponseForbidden('login required')