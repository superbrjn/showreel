from django import forms

from .models import Blogpost
#from .validators import validate_category

from django.contrib.auth import get_user_model
User = get_user_model()


#class BlogpostCreateForm(forms.Form): #Simple work with inputs
#    name = forms.CharField()
#    content = forms.CharField(required=False)
#    blogger = forms.CharField(required=False)
#
#    def clean_name(self):
#        name = self.cleaned_data.get("name")
#        if name == "Showerror":
#            raise forms.ValidationError("Not a valid name")
#        return name


class BlogpostCreateForm(forms.ModelForm): #work with form.as_p
    #email = forms.EmailField()
    #somecategory = forms.CharField(required=False, validators=[validate_somecategory])

    class Meta:
        model = Blogpost
        fields = [
            'name',
            'content',
            'blogger',
            #'slug'
        ]

    # custom validators
    def clean_name(self):
        name = self.cleaned_data.get("name")
        if name == "Showerror":
            raise forms.ValidationError("Not a valid name")
        return name



class RegisterForm(forms.ModelForm): #UserCreationForm
    #Imported form already has all the required fields, plus a repeated password.
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)
        #email = forms.EmailField(required=True, widget=forms.widgets.TextInput(attrs={'placeholder': 'Email'}))
        #first_name = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={'placeholder': 'First Name'}))
        #last_name = forms.CharField(required=True, widget=forms.widgets.TextInput(attrs={'placeholder': 'Last Name'}))
        #username = forms.CharField(widget=forms.widgets.TextInput(attrs={'placeholder': 'Username'}))

    class Meta:
        model = User
        fields = (
            #'username',
            'email',
            )

    def clean_email(self):
        email = self.cleaned_data.get("email")
        qs = User.objects.filter(email__iexact=email)#(email=email)
        if qs.exists():
            raise forms.ValidationError("You cannot use this email. It's already registered.")
        return email

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Oops! Passwords don't match.")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(RegisterForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        #user.password = "stringpassword" <-- never do this
        user.is_active = True #False

        if commit:
            user.save()
            #print(user.profile)
            #user.profile.send_activation_email() # celery ==> .delay
            # create a new user hash for activating email.
        return user
