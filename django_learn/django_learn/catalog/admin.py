from django.contrib import admin

# Register your models here.

# Minimal Registration of Models:
from .models import Author, Genre, Book, BookInstance

#admin.site.register(Book)
#admin.site.register(Author)
admin.site.register(Genre)
#admin.site.register(BookInstance)
#admin.site.register(Language)


""" --------------- Custom Admin panel view --------------- """


class BooksInline(admin.TabularInline):
    # Defines format of inline book insertion (used in AuthorAdmin)

    model = Book

### Define the admin class ###
"""class AuthorAdmin(admin.ModelAdmin):
    pass
"""
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'date_of_birth', 'date_of_death')
    fields = ['first_name', 'last_name', ('date_of_birth', 'date_of_death')] # add a field/row in a data table
    inlines = [BooksInline]

# Register the admin class with the associated model
admin.site.register(Author, AuthorAdmin) # --> @admin.register(Author)


### Register the Admin classes for Book using the decorator ###

class BooksInstanceInline(admin.TabularInline): # or admin.StackedInline
    model = BookInstance # linking
    extra = 0

#"""@admin.register(Book)
#class BookAdmin(admin.ModelAdmin):
#    pass
#"""
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'display_genre')
    inlines = [BooksInstanceInline] # linking insertion of BookInstance

### Register the Admin classes for BookInstance using the decorator ###
"""@admin.register(BookInstance)
class BookInstanceAdmin(admin.ModelAdmin):
    pass
"""
@admin.register(BookInstance)
class BookInstanceAdmin(admin.ModelAdmin):
    # Administration object for BookInstance models.
    # Defines:
    # - fields to be displayed in list view (list_display)
    # - filters that will be displayed in sidebar (list_filter)
    # - grouping of fields into sections (fieldsets)

    list_display = ('book', 'status', 'borrower','due_back', 'id')
    #list_display = ('book', 'status','due_back', 'id')
    list_filter = ('status', 'due_back')

    # add sections
    fieldsets = (
        (None, { # None or Name of a section
            'fields': ('book','imprint', 'id') # fields/rows in a data table
        }),
        ('Availability', {
            'fields': ('status', 'due_back','borrower')
        }),
    )
