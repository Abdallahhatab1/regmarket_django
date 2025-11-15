from django.db import models
from django.contrib.auth.models import User
import datetime
from decimal import Decimal, InvalidOperation

# Create your models here.
class CustomerReceipt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    birthdate = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    join_date = models.DateField(null=True, blank=True)
    local_id = models.IntegerField(unique=True, null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Receipt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.ForeignKey(CustomerReceipt, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"فاتورة {self.id} - {self.customer.first_name}"

class ReceiptItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE, related_name="items", default=1, null=True, blank=True)
    product_name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    tax = models.FloatField(default=0)
    discount = models.FloatField(default=0)
    category = models.CharField(max_length=100, default='')
    count = models.IntegerField(default=1)
    total = models.FloatField(default=0, blank=True, null=True)

    def __str__(self):
        return f"{self.product_name} - {self.count} x {self.price}"
    
class CurrencySetting(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=50, unique=True)  # "currency"
    value = models.CharField(max_length=50)             # "dollar" أو "other"

    def __str__(self):
        return f"{self.name}: {self.value}"


class Section(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    section_name = models.CharField(max_length=30)
    category = models.CharField(max_length=30)

    def __str__(self):
        return self.section_name
    

class Add_Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    section = models.ForeignKey('Section', on_delete=models.CASCADE, related_name='products')
    product_name = models.CharField(max_length=30, default='-')
    product_buy = models.CharField(max_length=30, default='0', null=True, blank=True)
    product_sell = models.CharField(max_length=30, default='0')
    product_tax = models.CharField(max_length=30, default='0', null=True, blank=True)
    product_category = models.CharField(max_length=30, default='-')
    product_count = models.CharField(max_length=30, default='1', null=True, blank=True)
    product_total = models.CharField(max_length=30, default='0', null=True, blank=True)

    def save(self, *args, **kwargs):
        try:
            buy = Decimal(self.product_buy)
            tax = Decimal(self.product_tax)
            count = Decimal(self.product_count)
            self.product_total = (buy + tax) * count
        except (InvalidOperation, TypeError):
            self.product_total = Decimal('0')
        super().save(*args, **kwargs)


class Admin(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    first_name = models.CharField(max_length=50, default='')
    last_name = models.CharField(max_length=50, default='')
    birthdate = models.DateField(default=datetime.date(2000, 1, 1))
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    available_hours = models.IntegerField(default=0)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, default='male')
    join_date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Customer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    first_name = models.CharField(max_length=50, default='')
    last_name = models.CharField(max_length=50, default='')
    birthdate = models.DateField(default=datetime.date(2000, 1, 1))
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, default='male')
    join_date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Currency(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    country = models.CharField(max_length=100)
    shortcut = models.CharField(max_length=10)
    symbol = models.CharField(max_length=10)
    value_per_usd = models.FloatField()

    def __str__(self):
        return f"{self.country} ({self.shortcut})"
    

class SeeReceipt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    tax = models.FloatField(default=0)
    discount = models.FloatField(default=0)
    category = models.CharField(max_length=100, default='Uncategorized')
    count = models.IntegerField(default=1)
    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]

    background = models.ImageField(upload_to='market_images/%y/%m/%d/', null=True, blank=True)
    image = models.ImageField(upload_to='market_images/%y/%m/%d/', null=True, blank=True)
    background = models.ImageField(upload_to='market_backgrounds/%y/%m/%d/', null=True, blank=True)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, default='male')
    birthdate = models.DateField(null=True, blank=True)
    market_name = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.user.username
