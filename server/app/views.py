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

@login_required(login_url='/accounts/login/')
def index(request):
    test_list = ['test1', 'test2']
    context = {"test_list": test_list}
    template = loader.get_template('home.html')
    return HttpResponse(template.render(context, request))

