import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mpa.settings")
django.setup()
import pytest
import unittest
from django.test import TestCase, Client
from django.contrib.auth.models import User
from unittest.mock import MagicMock, patch
import app.models as models

from model_bakery import baker, seq

class GetUserShortcutsAPITestCase(django.test.TestCase):
    def setUp(self):
        # create user
        self.user1 = User.objects.create_user(username='user1', password='test')
        self.user2 = User.objects.create_user(username='user2', password='test')
        # create client
        self.client = Client()
        # create 1 application
        self.application = baker.make('Application', name='app1')
        # create 3 shortcuts
        self.shortcuts = baker.make('Shortcut', application=self.application, command=seq('command'), _quantity=3)
        # create 2 user shortcuts for user1
        self.user1_shortcuts = [
            baker.make('UserShortcut', user=self.user1, shortcut=self.shortcuts[0]),
            baker.make('UserShortcut', user=self.user1, shortcut=self.shortcuts[1])]
        # create 1 user shortcut for user2
        self.user2_shortcuts = [
            baker.make('UserShortcut', user=self.user2, shortcut=self.shortcuts[2])
        ]
        
         
    def test_get_simple(self):
        # login with user1
        self.client.login(username='user1', password='test')
        # call api
        response = self.client.get('/api/user/shortcut')
        res = response.json()
        
        # Should return 2 UserShortcuts
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)
        self.assertEqual(
            sorted([r['shortcut']['command'] for r in res]),
            sorted([s.shortcut.command for s in self.user1_shortcuts]),
        )
        
        # When: logged in with user2
        self.client.login(username='user2', password='test')
        response = self.client.get('/api/user/shortcut')
        res = response.json()
        
        # Should return 1 UserShortcut
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(
            sorted([r['shortcut']['command'] for r in res]),
            sorted([s.shortcut.command for s in self.user2_shortcuts]),
        )
    
    def test_get_no_auth(self):
        # When: not logged in
        response = self.client.get('/api/user/shortcut')
        
        # Should return 302
        self.assertEqual(response.status_code, 302)
    
        