from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Section)

admin.site.register(models.Add_Product)

admin.site.register(models.Admin)

admin.site.register(models.Customer)

admin.site.register(models.Currency)

admin.site.register(models.CustomerReceipt)
admin.site.register(models.ReceiptItem)
admin.site.register(models.Receipt)


admin.site.register(models.Profile)