from django import template

register = template.Library()


@register.filter(name='split')
def split_string(value, arg):
    return value.split(arg)


@register.filter(name='multiply')
def multiply_int(value, arg):
    return int(value*arg)


@register.filter(name='indexer')
def indexer(value, arg):
    return value[arg]

