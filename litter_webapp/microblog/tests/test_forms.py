from django.test import TestCase

#import datetime
#from django.utils import timezone
from microblog.forms import BlogpostCreateForm, RegisterForm


class BlogpostFormTest(TestCase):

    def test_name_field_label(self):
        form = BlogpostCreateForm()
        self.assertTrue(form.fields['name'].label == None or form.fields['name'].label == 'name')

    def test_content_field_label(self):
        form = BlogpostCreateForm()
        self.assertTrue(form.fields['content'].label == None or form.fields['content'].label == 'content')

    def test_blogger_field_label(self):
        form = BlogpostCreateForm()
        self.assertTrue(form.fields['blogger'].label == None or form.fields['blogger'].label == 'blogger')

#    def test_slug_field_label(self):
#        form = BlogpostCreateForm()
#        self.assertTrue(form.fields['slug'].label == None or form.fields['slug'].label == 'slug')

    def test_content_field_help_text(self):
        form = BlogpostCreateForm()
        self.assertEqual(form.fields['content'].help_text,'Post whatever you want here, and wait a moderator to aproove.')


class RegisterFormTest(TestCase):

#    def test_username_field_label(self):
#        form = RegisterForm()
#        self.assertTrue(form.fields['username'].label == None or form.fields['username'].label == 'username')

#    def test_username_is_valid(self):
#        name = timezone.now() + datetime.timedelta(weeks=4)
#        form_data = {'name': name}
#        form = RegisterForm(data=form_data)
#        self.assertTrue(form.is_valid())

    def test_email_field_label(self):
        form = RegisterForm()
        self.assertTrue(form.fields['email'].label == None or form.fields['email'].label == 'email')

    def test_password_field_label(self):
        form = RegisterForm()
        self.assertTrue(form.fields['password'].label == None or form.fields['password'].label == 'password')

#    def test_slug_field_label(self):
#        form = RegisterForm()
#        self.assertTrue(form.fields['slug'].label == None or form.fields['slug'].label == 'slug')

#    def test_content_field_help_text(self):
#        form = RegisterForm()
#        self.assertEqual(form.fields['content'].help_text,'Post whatever you want here, and wait a moderator to aproove.')
