from django import forms
from .models import Section, Admin, Customer, Add_Product, SeeReceipt, ReceiptItem, Profile


from django.contrib.auth.hashers import make_password

from django.core.exceptions import ValidationError
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
import re

class SectionForm(forms.ModelForm):
    class Meta:
        model = Section
        fields = ['section_name',
                  'category',
                  ]
        
        labels = {
            'section_name': '',  # هذا يخفي الاسم
            'category': '',      # هذا يخفي الاسم
        }
        
        widgets = {
            'section_name': forms.TextInput(attrs={'placeholder': 'Enter section name'}),
            'category': forms.TextInput(attrs={'placeholder': 'Enter category'}),
        }


class AddProductForm(forms.ModelForm):
    product_name = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'name':'product_name', 'id': 'name_input', 'placeholder': 'Name'}),
        label=''
    )
    
    product_buy = forms.DecimalField(
        widget=forms.NumberInput(attrs={'name':'product_buy', 'id': 'buy_input', 'class': 'number_input', 'placeholder': 'Buy', 'onkeyup': 'getTotal()'}),
        label=''
    )
    
    product_sell = forms.DecimalField(
        required=True,
        widget=forms.NumberInput(attrs={'name':'product_sell', 'id': 'sell_input', 'class': 'number_input', 'placeholder': 'Sell', 'onkeyup': 'getTotal()'}),
        label=''
    )
    
    product_tax = forms.DecimalField(
        widget=forms.NumberInput(attrs={'name':'product_tax', 'id': 'taxes_input', 'class': 'number_input', 'placeholder': 'Taxes', 'onkeyup': 'getTotal()'}),
        label=''
    )
   
    product_category = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'name':'product_category', 'id': 'category_input', 'placeholder': 'Category'}),
        label=''
    )
   
    product_count = forms.DecimalField(
        widget=forms.NumberInput(attrs={'name':'product_count', 'id': 'count_input', 'placeholder': 'Count', 'onkeyup': 'getTotal()'}),
        label=''
    )
   
    class Meta:
        model = Add_Product
        fields = ['product_name', 'product_buy', 'product_sell', 'product_tax', 'product_category', 'product_count']


class AdminForm(forms.ModelForm):
    first_name = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'placeholder': 'first name'}),
        label='first name:'
    )
    
    last_name = forms.CharField(
        required = True,
        widget = forms.TextInput(attrs={'placeholder': 'last name'}),
        label = 'last name:'
    )
    
    birthdate = forms.DateField(
        required = True,
        widget = forms.DateInput(attrs={'type': 'date', 'min': '1900-01-01', 'max': '2020-12-31'}),
        label = 'birthdate:'
    )
    
    salary = forms.DecimalField(
        required = True,
        widget = forms.NumberInput(attrs={'placeholder': 'Per month', 'id': 'salary_input'}),
        label = 'salary:'
    )
    
    available_hours = forms.DecimalField(
        required = True,
        widget = forms.NumberInput(attrs={'type': 'range', 'min': 0, 'max': 12, 'step': 1, 'id': 'available_range'}),
        label = 'available hours:',
    )
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ] 
    gender = forms.ChoiceField(
        choices=GENDER_CHOICES,
        widget=forms.Select(attrs={'class': 'select_gender'}),
        required=True,
        label='Gender:'
    )
    
    
    class Meta:
        model = Admin
        fields = '__all__'
        
        
class CustomerForm(forms.ModelForm):
    first_name = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'placeholder': 'first name', 'id': 'first_name'}),
        label=''
    )
    
    last_name = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={'placeholder': 'last name', 'id': 'last_name'}),
        label=''
    )
    

    
    birthdate = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date', 'min': '1900-01-01', 'max': '2020-12-31', 'id': 'birthdate'}),
        required=True,
        label='Birthdate:'
    )
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    gender = forms.ChoiceField(
        choices=GENDER_CHOICES,
        widget=forms.Select(attrs={'class': 'select_gender', 'id': 'gender'}),
        required=True,
        label='Gender:'
    )
    
    
    class Meta:
        model = Customer
        
        exclude = ['user']

class SeeReceiptForm(forms.ModelForm):
    class Meta:
        model = ReceiptItem  
        fields = '__all__'
        exclude = ['receipt', 'total']  # تُملأ تلقائيًا
        widgets = {
            'product_name': forms.TextInput(attrs={'id': "name_input", 'placeholder': "name"}),
            'price': forms.NumberInput(attrs={'id': "price_input", 'class': "numbers_inputs", 'placeholder': "price"}),
            'tax': forms.NumberInput(attrs={'id': "tax_input", 'class': "numbers_inputs", 'placeholder': "tax"}),
            'discount': forms.NumberInput(attrs={'id': "discount_input", 'class': "numbers_inputs", 'placeholder': "discount"}),
            'category': forms.TextInput(attrs={'id': "category_input", 'placeholder': "category"}),
            'count': forms.NumberInput(attrs={'id': "count_input", 'placeholder': "count"}),
        }
        labels = {
            'product_name': '',
            'price': '',
            'tax': '',
            'discount': '',
            'category': '',
            'count': '',
        }



class SignUpForm(UserCreationForm): 
    
    
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'placeholder': 'youremail@example.com'}),
        label="Password",
    )
    
    background = forms.ImageField(
        required=False,
    )
    image = forms.ImageField(
        required=False,
    )
    
    gender = forms.ChoiceField(
        choices=Profile.GENDER_CHOICES,
        widget=forms.Select(attrs={'class': 'select_gender'}),
    )
    birthdate = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    
    market_name = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'placeholder': 'market name (optional)'}),
        label="market name",
    )
    
    
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'password', 'onkeyup': 'getStrongResualt()', 'id': 'password_input'}),
        label="Password",
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'confirm password'}),
        label="Confirm Password",
    )

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')

        widgets = {
            'first_name': forms.TextInput(attrs={'placeholder': 'First Name'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Last Name'}),
            'username': forms.TextInput(attrs={'placeholder': 'Username'}),
            'birthdate': forms.DateInput(attrs={'type': 'date', 'id': 'birthdate_input', 'min': "1925-01-01", 'max': "2025-12-31"}),
        }



    def clean_password1(self):
        password = self.cleaned_data.get('password1')
        if len(password) < 8:
            raise forms.ValidationError("Minimum of 8 characters")
        if not re.search(r"[A-Z]", password):
            raise forms.ValidationError("At least one uppercase letter")
        if not re.search(r"[a-z]", password):
            raise forms.ValidationError("At least one lowercase letter")
        if not re.search(r"[0-9]", password):
            raise forms.ValidationError("At least one number")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise forms.ValidationError("At least one special character")
        return password