from django.db import models
from django.db.models.signals import pre_save, post_save
from django.urls import reverse

# Making a fail-safe instance, standard auth
from django.conf import settings #<--from django.contrib.auth.models import User
#User = settings.AUTH_USER_MODEL

# Making email a primary auth method
#from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
#from django.utils.translation import ugettext_lazy as _
#import hashlib

#from .utils import code_generator
#from django.core.mail import send_mail

#from .utils import unique_slug_generator
#from .validators import validate_category
#from django.db.models import Q

# =====================
#from django.dispatch import receiver #for a second way
#import pillow #for an image upload




class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        #Create and save a user with the given email and password.
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        print(user)
        user.set_password(password)
        user.save(using=self._db)
        print(user)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

#    def create_staffuser(self, email, password, **extra_fields):
#        #Create and save an admin user with the given email and password.
#        extra_fields.setdefault('is_staff', True)
#        extra_fields.setdefault('is_superuser', False)
#        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        #Create and save a superuser with the given email and password.
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

#class User(models.Model):
    # username(max_length=150) #Required
    # first_name(blank=True)
    # last_name(blank=True)
    # email
    # password
    # Groups #Many-to-many relationship
    # user_permissions #Many-to-many relationship
    # is_staff(Boolean) #access to admin-panel
    # is_active(Boolean)
    # is_superuser(Boolean)
    # last_login(datetime)
    # date_joined(datetime)


class User(AbstractBaseUser, PermissionsMixin): #Auth-info
    email = models.EmailField(verbose_name='email address', unique=True)
    ##first_name = models.CharField(verbose_name='first name', max_length=30, blank=True)
    ##last_name = models.CharField(verbose_name='last name', max_length=30, blank=True)
    ##date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    is_active = models.BooleanField(verbose_name='active', default=True)
    is_staff = models.BooleanField(default=False) # an admin user; non super-user
    is_admin = models.BooleanField(default=False) # a superuser
    # notice the absence of a "Password field", that's built in.

    objects = UserManager()

    USERNAME_FIELD = 'email' # primary identifier #(unique=True)
    REQUIRED_FIELDS = [] # Email & Password are required by default.

#    class Meta:
#        verbose_name = _('user')
#        verbose_name_plural = _('users')

    def __str__(self): # __unicode__ on Python 2
        return self.email

#    def get_full_name(self): # The user is identified by email
#        return self.email
#        #full_name = '%s %s' % (self.first_name, self.last_name)
#        #return full_name.strip() # Returns the first_name plus the last_name, with a space in between.
#
#    def get_short_name(self): # The user is identified by email
#        return self.email
#        #return self.first_name # Returns the short name for the user.

#    def email_user(self, subject, message, from_email=None, **kwargs): # Sends an email to this User.
#        send_mail(subject, message, from_email, [self.email], **kwargs)

#    def has_perm(self, perm, obj=None):
#        "Does the user have a specific permission?"
#        # Simplest possible answer: Yes, always
#        return True
#
#    def has_module_perms(self, app_label):
#        "Does the user have permissions to view the app `app_label`?"
#        # Simplest possible answer: Yes, always
#        return True
#
#    @property
#    def is_staff(self):
#        "Is the user a member of staff?"
#        # Simplest possible answer: All admins are staff (if self.is_admin)
#        return self.is_staff
#
#    @property #inherited from PermissionsMixin
#    def is_admin(self):
#        "Is the user an admin member?"
#        return self.is_admin
#
#    @property
#    def is_active(self):
#        "Is the user active?"
#        return self.is_active



# Blog
class Profile(models.Model): #User-info
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True) #user.profile
    #followers = models.ManyToManyField(User, related_name='is_following', blank=True)#user.followers.all() or user.is_following.all()
    ##following = models.ManyToManyField(User, related_name='following', blank=True)#user.following.all()
    timestamp = models.DateTimeField(auto_now_add=True) #unseen but there
    updated = models.DateTimeField(auto_now=True) #unseen
    #blogname = models.CharField(max_length=60, help_text="Name your blog or make a nickname.")
    #tagline = models.TextField(max_length=140, blank=True, help_text="Give a description to your blog here.")
    ##avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    ##likes = models.ManyToManyField('Blogpost', through = 'Likes', related_name = 'likedby', blank = True)

    def __str__(self):
        #return self.user.username #email
        return self.user.email
        #return self.blogname

#    def get_absolute_url(self):
#        return reverse('profile-detail', args=[str(self.slug)]) #blogname
#        #return reverse('profile-detail', args=[str(self.id)])

    #create profile if user already exists
#    @receiver(post_save, sender=User)
#    def create_user_profile(sender, instance, created, **kwargs):
#        if created:
#            Profile.objects.create(user=instance)
#
#    @receiver(post_save, sender=User)
#    def save_user_profile(sender, instance, **kwargs):
#        instance.profile.save()

#User.profile = property(lambda u: Profile.objects.get_or_create(user=u)[0]) #one more way

# if user created before profile, create profile and link them together
def post_save_user_receiver(sender, instance, created, *args, **kwargs):
    if created:
        profile, is_created = Profile.objects.get_or_create(user=instance)
        # make new users to follow someone obligated-official account:
        default_user_profile = Profile.objects.get_or_create(user__id=1)[0] #first user .get(user__id=1), or .get(user__username=someone)
#        default_user_profile.followers.add(instance)
        #default_user_profile.followers.remove(instance)
        #default_user_profile.save() #with ManyToManyField no need to
        #make some content:
#        profile.followers.add(default_user_profile.user)
#        profile.followers.add(2)

post_save.connect(post_save_user_receiver, sender=User)


class Blogpost(models.Model):#???blogger = models.ForeignKey(Profile,
    blogger = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True) #related_name = 'blogger'
    # get rid of blogpost.name everywhere to make it microblog
    name = models.CharField(max_length=80) #alt of blogpost_id or blogpost_header
    content = models.TextField(max_length=140, help_text="Post whatever you want here, and wait a moderator to aproove.")
    #file_upload = models.ImageField(upload_to='usermedia/', height_field=320, width_field=240, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True) #unseen, but there
    updated = models.DateTimeField(auto_now=True) #unseen
    slug = models.SlugField(null=True, blank=True)# instead of (unique=True), wich reqires default #alt of blogpost_url

    #def get_absolute_url(self):
    #    # Returns the url to access a particular blog instance.
    #    return reverse('blogpost-detail', args=[str(self.slug)])
    #    #return reverse('blogposts:detail', kwargs={'slug': self.slug})
    #    #return reverse('blogpost-detail', args=[str(self.id)])

    def __str__(self):
        return self.name #journal-style

        #len_title = 40 #microblog-style
        #if len(self.content) > len_title:
        #    titlestring = self.content[:len_title] + '...'
        #else:
        #    titlestring = self.content
        #return titlestring

    @property
    def title(self):
        return self.name # obj.name ==> obj.title

# SIGNALS
#def bp_pre_save_receiver(sender, instance, *args, **kwargs):
#    #print('saving...')
#    #print(instance.timestamp)
#    instance.category = instance.category.capitalize()
#    if not instance.slug:
#        instance.slug = unique_slug_generator(instance)
#
#pre_save.connect(bp_pre_save_receiver, sender=Blogpost)



# == POSSIBLE FUTURE DEVELOPMENT PATH == #

#class Likes(models.Model):
#    liked_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
#    profile = models.ForeignKey(Profile, related_name = 'liked_by')
#    entry = models.ForeignKey(Entry, null=True)

#class Activity(models.Model):
#    actor = models.ForeignKey(Profile, related_name = 'actor')
#    receiver = models.ForeignKey(Profile, related_name = 'receiver')
#    action = models.CharField(max_length=12)
#    micropost = models.ForeignKey(Entry, null=True, blank=True)
#    time = models.DateTimeField(auto_now_add=True)
