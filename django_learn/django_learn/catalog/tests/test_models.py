from django.test import TestCase

# to run:
# python manage.py test

from catalog.models import Author

class AuthorModelTest(TestCase): # наследуем от TestCase (unittest)

    @classmethod
    def setUpTestData(cls):
        #Set up non-modified objects used by all test methods
        Author.objects.create(first_name='Big', last_name='Bob') # immutable test-data -- test User

    def test_first_name_label(self): # reasonable name that makes sense
        author=Author.objects.get(id=1) # new instance obj for testing
        field_label = author._meta.get_field('first_name').verbose_name # what to test (getting value)
        self.assertEquals(field_label,'first name') # this.considering(obj_one, eq expected obj_two)

    def test_last_name_label(self):
        author=Author.objects.get(id=1)
        field_label = author._meta.get_field('last_name').verbose_name # verbose_name -- form labels
        self.assertEquals(field_label,'last name') # shows value if wrong

    def test_date_of_birth_label(self):
        author=Author.objects.get(id=1)
        field_label = author._meta.get_field('date_of_birth').verbose_name
        self.assertEquals(field_label,'date of birth')

    def test_date_of_death_label(self):
        author=Author.objects.get(id=1)
        field_label = author._meta.get_field('date_of_death').verbose_name
        self.assertEquals(field_label,'died')

    def test_first_name_max_length(self):
        author=Author.objects.get(id=1)
        max_length = author._meta.get_field('first_name').max_length
        self.assertEquals(max_length,100)

    def test_last_name_max_length(self):
        author=Author.objects.get(id=1)
        max_length = author._meta.get_field('last_name').max_length
        self.assertEquals(max_length,100)

    def test_object_name_is_last_name_comma_first_name(self):
        author=Author.objects.get(id=1)
        #expected_object_name = '%s, %s' % (author.last_name, author.first_name)
        expected_object_name = '{0}, {1}'.format(author.last_name,author.first_name)

        self.assertEquals(expected_object_name,str(author))

    def test_get_absolute_url(self):
        author=Author.objects.get(id=1)
        #This will also fail if the urlconf is not defined.
        self.assertEquals(author.get_absolute_url(),'/catalog/author/1')
