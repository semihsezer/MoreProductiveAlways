from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.http import JsonResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.db import connections
from datetime import datetime
import json

import os
import structlog
from collections import OrderedDict
import requests

import app.models as models
import app.utils as utils
from app.forms import SignUpForm


logger = structlog.get_logger(__name__)


def _not_found():
    return JsonResponse({'message': 'Property Not Found'}, status=404)

def example_ajax(request):
    return JsonResponse({'data': 'test'}, status=200)


def login_user(request):
    loginFail = 'False'
    message = ''
    if request.POST:
        user = authenticate(request,
            username=request.POST['username'].lower(), password=request.POST['password'])

        if user is not None:
            login(request, user)
            return HttpResponseRedirect('/')
        else:
            loginFail = 'True'
            message = 'Wrong credentials.'

    context = {
        'loginFail': loginFail,
        'message': message
    }
    template = loader.get_template('bootstrap/login.html')
    return HttpResponse(template.render(context, request))

def logout_user(request):
    logout(request)
    return HttpResponseRedirect('/accounts/login/')

def signup(request):
    if request.user and request.user.is_authenticated:
        return redirect('/')
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('/')
    else:
        form = SignUpForm()
    data = {
        'title': 'Sign Up',
        'form': form,
        'submit_text': 'Submit'
    }
    return render(request, 'signup_form.html', data)

@login_required(login_url='/accounts/login/')
def account(request):
    user = request.user
    template = loader.get_template('account.html')
    context = {}
    return HttpResponse(template.render(context, request))

@login_required(login_url='/accounts/login/')
def version(request):
    versionArray = []
    with open('version.txt', 'r') as file:
        versionArray = file.read().split('\n')
    context = {'versionArray': versionArray}
    template = loader.get_template('version.html')
    return HttpResponse(template.render(context, request))

def health(request):
    # TODO:
    data = {
        'status': 'ok',
    }
    return JsonResponse(data)

def get_shortcuts(request):
    if request.method != 'GET':
        return HttpResponseServerError('Only GET is allowed')
    
    query = models.Shortcut.objects
    if request.GET.get('application_name'):
        application_name = request.GET.get('application_name')
        query = query.filter(application__name=application_name)
    
    # LATER: use fuzzy search
    if request.GET.get('description'):
        description = request.GET.get('description')
        query = query.filter(description__icontains=description)
   
        
    # LATER: handle pagination
    shortcuts = query.all()
    shortcuts = utils.serialize_shortcuts(shortcuts)
    return JsonResponse(shortcuts, safe=False)
    
# Write a function to get the user's shortcuts from the database
# Login should be required to access this page
# TODO: enable login_required
# @login_required(login_url='/accounts/login/')
def get_user_shortcuts(request):
    if request.method != 'GET':
        return HttpResponseServerError('Only GET is allowed')
    
    user = request.user
    # TODO
    #query = models.UserShortcut.objects.filter(user=user)
    query = models.UserShortcut.objects
    if request.GET.get('application_name'):
        application_name = request.GET.get('application_name')
        query = query.filter(application__name=application_name)
    
    # LATER: use fuzzy search
    if request.GET.get('description'):
        description = request.GET.get('description')
        query = query.filter(description__icontains=description)

def get_applications(request):
    if request.method == 'GET':
        applications = models.Application.objects.all()
        applications = utils.serialize_applications(applications)
        return JsonResponse(applications, safe=False)
    else:
        return HttpResponseServerError('Only GET is allowed')

def get_user_ideas(request):
    if request.method == 'GET':
        user = request.user
        # TODO
        #query = models.UserShortcut.objects.filter(user=user)
        query = models.Idea.objects
        status = request.GET.get("status")
        if status:
            # TODO: assert status is one of the valid choices
            query = query.filter(status=status)
    
        # LATER: handle pagination
        user_ideas = query.all()
        user_ideas = utils.serialize_user_ideas(user_ideas)
        return JsonResponse(user_ideas, safe=False)
    elif request.method == "POST":
        data = json.loads(request.body)
        user = request.user
        title = data.get('title')
        description = data.get('description')
        application = data.get('application')
        type = data.get('type')
        status = data.get('status')
        idea = models.Idea(user=user, title=title, description=description, application=application)
        idea.save()
        return JsonResponse({'id': idea.id}, status=200)
    elif request.method == "PUT":
        # TODO: cleanup when we switch to Django REST
        data = json.loads(request.body)
        id = data.get('id') 
        idea = models.Idea.objects.get(id=id)
        
        idea.title = data.get('title')
        idea.description = data.get('description')
        idea.application = data.get('application')
        idea.type = data.get('type')
        idea.status = data.get('status')
        idea.save()
        
        return JsonResponse({'id': idea.id}, status=200)
    elif request.method == "DELETE":
        data = json.loads(request.body)
        ids = data.get('ids')
        models.Idea.objects.filter(id__in=ids).delete()
        return JsonResponse({'message': 'Ideas were deleted successfully.'}, status=200)
    else:
        return HttpResponseServerError('Only GET and POST are allowed')
    
@login_required(login_url='/accounts/login/')
def index(request):
    test_list = ['test1', 'test2']
    context = {"test_list": test_list}
    template = loader.get_template('home.html')
    return HttpResponse(template.render(context, request))

