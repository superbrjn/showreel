from django.test import TestCase

# to run:
# python manage.py test

from .models import Blogpost, Profile, User
#from .models import User as CustomUser
#from django.contrib.auth.models import User
#from django.conf import settings
#User = settings.AUTH_USER_MODEL

import datetime


class CustomUserModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        #Set up non-modified objects used by all test methods
        test_user1 = User.objects.create_user(
            email='mail@test.com'
            password='testing12345',
            #first_name='Alice',
            #last_name='Wonderland'
            )
        test_user1.save()
        #CustomUser.objects.create(user=test_user1)
        User.objects.create(user=test_user1)

#   def test_first_name_label(self):
#        user = CustomUser.objects.get(id=1)
#        field_label = user._meta.get_field('first_name').verbose_name
#        self.assertEquals(field_label,'first name')

#    def test_last_name_label(self):
#        profile = Profile.objects.get(id=1)
#        field_label = profile._meta.get_field('last_name').verbose_name
#        self.assertEquals(field_label,'last name') # shows value if wrong

#    def test_first_name_max_length(self):
#        user=CustomUser.objects.get(id=1)
#        max_length = user._meta.get_field('first_name').max_length
#        self.assertEquals(max_length,30)

#    def test_last_name_max_length(self):
#        user=CustomUser.objects.get(id=1)
#        max_length = user._meta.get_field('last_name').max_length
#        self.assertEquals(max_length,30)

#    def test_object_name_is_last_name_comma_first_name(self):
#        user=CustomUser.objects.get(id=1)
#        #expected_object_name = '%s, %s' % (user.last_name, user.first_name)
#        expected_object_name = '{0}, {1}'.format(user.last_name,user.first_name)
#        self.assertEquals(expected_object_name,str(user))

    def test_if_admin(self):
        #user=CustomUser.objects.get(id=1)
        user = User.objects.get(id=1)
        admin = user.is_admin
        self.assertEquals(admin, User.is_admin)


class ProfileModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        #Set up non-modified objects used by all test methods
        test_user1 = User.objects.create_user(
            #username='testuser1',#'mail@test.com'
            email='mail@test.com'
            password='testing12345',
            #first_name='Alice',
            #last_name='Wonderland'
            )
        test_user1.save()
        #test_user2 = User.objects.create_user(username='testuser2', password='12345')
        #test_user2.save()
        #blogpost_test = Blogpost.objects.create(name='Test Blog 1',blogger=profile,content='Test Blogpost 1 message')
        Profile.objects.create(user=test_user1)#(user=test_user1, bio='This is a bio')
        #profile_follow=Follow.objects.create(content='Test Comment 1 message', blogger=test_user2,profile=blogpost_test)


    def test_user_label(self):
        user=Profile.objects.get(id=1) #blogger=Profile.objects.get(id=1)
        field_label = profile._meta.get_field('user').verbose_name
        self.assertEquals(field_label,'user')

    def test_object_name(self): #__str__
        profile=Profile.objects.get(id=1)
        expected_object_name = profile.user.username
        self.assertEquals(expected_object_name,str(profile))

#    def test_get_absolute_url(self):
#        profile=Profile.objects.get(id=1)
#        #This will also fail if the urlconf is not defined.
#        self.assertEquals(profile.get_absolute_url(),'/profiles/1')

#    def test_tagline_label(self):
#        profile = Profile.objects.get(id=1)
#        field_label = profile._meta.get_field('tagline').verbose_name
#        self.assertEquals(field_label,'tagline')

#    def test_tagline_max_length(self):
#        profile=Profile.objects.get(id=1)
#        max_length = profile._meta.get_field('tagline').max_length
#        self.assertEquals(max_length,140)


class BlogpostModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        #Set up non-modified objects used by all test methods
        test_user1 = User.objects.create_user(email='testuser1@mail.com', password='testing12345')
        test_user1.save()
        profile = Profile.objects.create(user=test_user1)
        blogpost = Blogpost.objects.create(
            blogger=profile,
            name='Test Blogpost name 1',
            content='Test Blogpost 1 Description'
            )


#    def test_get_absolute_url(self):
#        blogpost=Blogpost.objects.get(id=1)
#        self.assertEquals(blogpost.get_absolute_url(),'/blogpost-detail/1')

    def test_name_label(self):
        blogpost=Blogpost.objects.get(id=1)
        field_label = blogpost._meta.get_field('name').verbose_name
        self.assertEquals(field_label,'name')

    def test_object_name(self):
        blogpost=Blogpost.objects.get(id=1)
        expected_object_name = blogpost.name
        self.assertEquals(expected_object_name,str(blogpost))

    def test_name_max_length(self):
        blogpost=Blogpost.objects.get(id=1)
        max_length = blogpost._meta.get_field('name').max_length
        self.assertEquals(max_length,80)

    def test_content_label(self):
        blogpost=Blogpost.objects.get(id=1)
        field_label = blogpost._meta.get_field('content').verbose_name
        self.assertEquals(field_label,'content')

    def test_content_max_length(self):
        blogpost=Blogpost.objects.get(id=1)
        max_length = blogpost._meta.get_field('content').max_length
        self.assertEquals(max_length,140)

    def test_timestamp_label(self):
        blogpost=Blogpost.objects.get(id=1)
        field_label = blogpost._meta.get_field('timestamp').verbose_name
        self.assertEquals(field_label,'timestamp')

    def test_timestamp(self):
        blogpost=Blogpost.objects.get(id=1)
        timestamp = blogpost.timestamp
        self.assertEquals(timestamp,datetime.date.today()) #datetime now
