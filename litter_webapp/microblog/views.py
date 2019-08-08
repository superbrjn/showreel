from django.shortcuts import render, get_object_or_404, redirect
from django.views import generic
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

from django.http import HttpResponse, HttpResponseRedirect, Http404
#from django.db.models import Q

from .models import Blogpost, Profile#, User
from .forms import RegisterForm, BlogpostCreateForm

# instance of user
from django.contrib.auth import get_user_model
User = get_user_model()

#===============================
#from django.urls import reverse_lazy
#from django.contrib.auth.models import User
##from django.views.generic.edit import CreateView, UpdateView, DeleteView
#from django.contrib.auth import login, authenticate, logout
#from .forms import AuthenticateForm, RegisterForm, EntryForm #UserCreateForm, TweetForm
##from django.db.models import Count
#from django.core.exceptions import ObjectDoesNotExist


# ==== Posts CRUD ====

class HomeView(generic.View): #dashboard feed
    def get(self, request, *args, **kwargs): # Feed
        if not request.user.is_authenticated:
            return render(request, "home.html", {})

        user = request.user
        qs = Blogpost.objects.all().order_by("-updated")[:3]
        #print(f"USER: {user}")
        #print(f"Aprooved posts: {aprooved_posts}")
        #print(f"Q: {qs}")
        return render(request, "home.html", {'object_list': qs})

class DashboardView(generic.View): #dashboard feed
    def get(self, request, *args, **kwargs): # Feed
        if not request.user.is_authenticated:
            return render(request, "home.html", {})

        user = request.user
#        is_following_user_ids = [x.user.id for x in user.is_following.all()]
#        qs = Item.objects.filter(user__id__in=is_following_user_ids, public=True).order_by("-updated")[:3]
        #print(f"USER: {user}")
        #print(f"FOLLOWING USERS: {is_following_user_ids}")
        #print(f"Q: {qs}")
        #return render(request, "dashboard.html", {'object_list': qs})
        return render(request, "dashboard.html", {})

class ModerationView(generic.View): #dashboard feed
    def get(self, request, *args, **kwargs): # Feed
        if not request.user.is_staff:
            return render(request, "dashboard.html", {}) #redirect to 404

        user = request.user
#        is_following_user_ids = [x.user.id for x in user.is_following.all()]
#        qs = Item.objects.filter(user__id__in=is_following_user_ids, public=True).order_by("-updated")[:3]
        #print(f"USER: {user}")
        #print(f"FOLLOWING USERS: {is_following_user_ids}")
        #print(f"Q: {qs}")
        #return render(request, "blogpost/home-feed.html", {'object_list': qs})
        return render(request, "dashboard.html", {})


class BlogpostListView(LoginRequiredMixin, generic.ListView):
    def get_queryset(self):
        return Blogpost.objects.filter(blogger=self.request.user)


"""class BlogpostListbyProfileView(LoginRequiredMixin, generic.ListView):
    model = Blogpost
    paginate_by = 10
    #template_name ='blog/blog_list_by_author.html'

    def get_queryset(self):
        #Return list of Entry objects created by Author (author id specified in URL)
        #Entry.objects.order_by('headline').filter(pub_date__year=2006)
        target_author = get_object_or_404(Profile, pk = self.kwargs['pk'])
        return Blogpost.objects.filter(author=target_author)

    def get_context_data(self, **kwargs):
        # Add Author to context so they can be displayed in the template
        # Call the base implementation first to get a context
        context = super(EntryListbyAuthorView, self).get_context_data(**kwargs)
        # Get the blogger object from the "pk" URL parameter and add it to the context
        context['author'] = get_object_or_404(Author, pk = self.kwargs['pk'])
        return context


class BlogpostListbyOldestView(LoginRequiredMixin, generic.ListView):
    model = Entry
    paginate_by = 10
    #template_name ='blog/blog_list_by_author.html'

    def get_queryset(self):
        #target_post = get_object_or_404(timestamp, pk = self.kwargs['pk'])
        return Blogpost.objects.order_by('timestamp').filter(blogpost=self.timestamp)

    def get_context_data(self, **kwargs):
    # Add timestamp to context so it can be displayed in the template
        # Call the base implementation first to get a context
        context = super(EntryListbyDateView, self).get_context_data(**kwargs)
        # Get the blogger object from the "pk" URL parameter and add it to the context
        context['timestamp'] = get_object_or_404(timestamp, pk = self.kwargs['pk'])
        return context"""


class BlogpostDetailView(LoginRequiredMixin, generic.DetailView):
    def get_queryset(self):
        return Blogpost.objects.filter(blogger=self.request.user)


class BlogpostCreateView(LoginRequiredMixin, generic.CreateView):
    form_class = BlogpostCreateForm
    login_url = '/login/' # overrides default setting
    template_name = 'form.html' #'Blogpost/form.html'
    #success_url = "/posts/"

    def form_valid(self, form):
        instance = form.save(commit=False)
        instance.blogger = self.request.user #User.is_authenticated and is not an AnonymousUser
        #instance.save()
        return super(BlogpostCreateView, self).form_valid(form)

    def get_context_data(self, *args, **kwargs):
        context = super(BlogpostCreateView, self).get_context_data(*args, **kwargs)
        context['title'] = 'Add post'
        return context


class BlogpostUpdateView(LoginRequiredMixin, generic.UpdateView):
    form_class = BlogpostCreateForm
    login_url = '/login/' # overrides default setting
    template_name = 'detail_update.html'
    #success_url = "/posts/"

    def get_queryset(self):
        return Blogpost.objects.filter(blogger=self.request.user)

    def get_context_data(self, *args, **kwargs):
        context = super(BlogpostUpdateView, self).get_context_data(*args, **kwargs)
        #name = self.get_object().name
        #context['title'] = f'Edit post: {name}'
        context['title'] = 'Edit post'
        return context



# ==== Profiles CRUD ====

class RegisterView(generic.CreateView):
    form_class = RegisterForm
    template_name = 'registration/register.html'
    success_url = '/'

    def dispatch(self, *args, **kwargs):
        #if self.request.user.is_authenticated:
        #    return redirect("/logout")
        return super(RegisterView, self).dispatch(*args, **kwargs)


class ProfileDetailView(generic.DetailView):
    #queryset = User.objects.filter(is_active=True)
    template_name = 'profiles/user.html'

    def get_object(self):
        username = self.kwargs.get("username") #get("username", None)
        if username is None:
            raise Http404
        return get_object_or_404(User, username__iexact=username, is_active=True)

    def get_context_data(self, *args, **kwargs):
        context = super(ProfileDetailView, self).get_context_data(*args, **kwargs)
        #print(context)
        #user = self.get_object() #to make sure we got user
#        user = context['user'] #we sure have it
#        is_following = False
#        if user.profile in self.request.user.is_following.all():
#            is_following = True
#        context['is_following'] = is_following
#        query = self.request.GET.get('q') #self.kwargs.get("")
#        items_exists = Item.objects.filter(user=user).exists()#filter(user=self.get_object())
#        qs = BistroLocation.objects.filter(owner=user).search(query)
        #if query:
            #qs = BistroLocation.objects.search(query) #added in model manager
            #qs = qs.filter(name__icontains=query)
            #qs = qs.search(query)
        #    qs = qs
#        if items_exists and qs.exists():
#            context['locations'] = qs
        return context




#===============================
"""def index(request, auth_form=None, user_form=None):
    # User is logged in
    if request.user.is_authenticated():
        entry_form = EntryForm()
        user = request.user
        entries_self = Entry.objects.filter(user=user.id)
        entries_buddies = Entry.objects.filter(user__profile__in=user.profile.follows.all)
        entries = entries_self | entries_buddies

        return render(request,
                      'buddies.html',
                      {'entry_form': entry_form, 'user': user,
                       'entries': entries,
                       'next_url': '/', })
    else:
        # User is not logged in
        auth_form = auth_form or AuthenticateForm()
        user_form = user_form or RegisterForm() #UserCreateForm()

        return render(request,
                      'home.html',
                      {'auth_form': auth_form, 'user_form': user_form, })


@login_required
def public(request, entry_form=None):
    entry_form = entry_form or EntryForm()
    entries = Entry.objects.reverse()[:10]
    return render(request,
                  'public.html',
                  {'entry_form': entry_form, 'next_url': '/microposts',
                   'entries': entries, 'username': request.user.username})


def get_latest(user):
    try:
        return user.entry.order_by('-id')[0]
    except IndexError:
        return ""

@login_required
def users(request, username="", entry_form=None):
    if username:
        # Show a profile
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404
        entries = Entry.objects.filter(user=user.id)
        if username == request.user.username or request.user.profile.follows.filter(user__username=username):
            # Self Profile or buddies' profile
            return render(request, 'user.html', {'user': user, 'entries': entries, })
        return render(request, 'user.html', {'user': user, 'entries': entries, 'follow': True, })
    users = User.objects.all().annotate(entries_count=Count('entry'))
    entries = map(get_latest, users)
    obj = zip(users, entries)
    entry_form = entry_form or EntryForm()
    return render(request,
                  'profiles.html',
                  {'obj': obj, 'next_url': '/users/',
                   'entry_form': entry_form,
                   'username': request.user.username, })

@login_required
def follow(request):
    if request.method == "POST":
        follow_id = request.POST.get('follow', False)
        if follow_id:
            try:
                user = User.objects.get(id=follow_id)
                request.user.profile.follows.add(user.profile)
            except ObjectDoesNotExist:
                return redirect('/users/')
    return redirect('/users/')"""
