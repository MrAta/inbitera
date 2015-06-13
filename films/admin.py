from django.contrib import admin
from .models import Film, Agent, FilmAgent

admin.site.register(Film)
admin.site.register(Agent)
admin.site.register(FilmAgent)
