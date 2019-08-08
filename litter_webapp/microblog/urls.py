from django.urls import path

from django.views.generic import TemplateView
from django.contrib.auth.views import LoginView, LogoutView
from . import views

urlpatterns = [
    # /microblog/
    path('', views.HomeView.as_view(), name='home'), #homepage for unregistered users
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'), #homepage for registered users
    path('moderation/', views.ModerationView.as_view(), name='moderation'), #page for admin users to aproove posts

    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    #path('profile-follow/', views.ProfileFollowToggle.as_view(), name='follow'),

    # Posts CRUD
    path('posts/create/',  views.BlogpostCreateView.as_view(), name='post-create'),
    ##path('posts/<slug>/edit/', views.BlogpostUpdateView.as_view(), name='post-edit'),
    path('posts/<slug>/', views.BlogpostUpdateView.as_view(), name='post-detail'), #<slag:slag>/
    path('posts/', views.BlogpostListView.as_view(), name='post-list'),

    # Profiles CRUD
    path('profiles/<username>/', views.ProfileDetailView.as_view(), name='profile-detail'), #<slag:username>/
    ##path('profiles/<username>/edit/', views.ProfileUpdate.as_view(), name='profile-edit'),
    ##path('profiles/<username>/delete/', views.ProfileDelete.as_view(), name='profile-delete'), #deactivation

    path('about/', TemplateView.as_view(template_name='about.html'), name='about'),
]
