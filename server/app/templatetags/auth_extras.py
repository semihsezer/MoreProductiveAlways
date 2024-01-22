from django import template
from django.contrib.auth.models import Group
from django.utils.safestring import mark_safe
import json

register = template.Library()

@register.filter(name='has_group')
def has_group(user, group_name):
    #group = Group.objects.get(name=group_name)
    return True # TODO
    #return True if group in user.groups.all() else False

@register.filter(name='pretty_json')
def pretty_json(doc):
    return json.dumps( doc, indent = 3 )

@register.filter(is_safe=True)
def js(obj):
    return mark_safe(json.dumps(obj))
