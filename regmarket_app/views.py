from django.shortcuts import render, redirect, get_object_or_404
from .models import Section, Admin, Customer, Currency, Add_Product, CustomerReceipt, Receipt, ReceiptItem, CurrencySetting, SeeReceipt, Profile
from .forms import SectionForm, AdminForm, CustomerForm, AddProductForm, SeeReceiptForm, SignUpForm
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
from django.dispatch import receiver
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required


# Create your views here.

@login_required(login_url='login')
def peoples(request):
    x = {'home': 'myhome'}
    return render(request, 'pages/peoples.html', x)


@login_required(login_url='login')
def settings(request):
    x = {'home': 'myhome'}
    return render(request, 'pages/settings.html', x)


@login_required(login_url='login')
def home(request):
    x = {'home': 'myhome'}
    return render(request, 'pages/home.html', x)


@login_required(login_url='login')
@csrf_exempt
def receipts_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        customer_data = data["customer"]

        # الحصول على العميل أو إنشاؤه
        customer, created = CustomerReceipt.objects.get_or_create(
            local_id=customer_data["local_id"],
            defaults={
                "first_name": customer_data["first_name"],
                "last_name": customer_data["last_name"],
                "birthdate": customer_data["birthdate"],
                "gender": customer_data["gender"],
                "join_date": customer_data["join_date"],
            }
        )

        # إنشاء الإيصال (سيحصل على التاريخ الحالي تلقائيًا)
        receipt = Receipt.objects.create(customer=customer, user=request.user)

        # تعديل التاريخ إذا تم تمرير التاريخ في POST (اختياري)
        if "date_created" in data:
            # افترض أن التاريخ يأتي بصيغة "YYYY-MM-DD HH:MM"
            receipt.date_created = datetime.strptime(data["date_created"], "%Y-%m-%d %I:%M%p")

            receipt.save()

        # إضافة العناصر
        for item in data["items"]:
            ReceiptItem.objects.create(
                receipt=receipt,
                product_name=item["product_name"],
                price=item["product_price"],
                tax=item["product_tax"],
                discount=item["product_discount"],
                category=item.get("product_category", "Uncategorized"),
                count=item["product_count"],
                total=item["product_total"],
                user=request.user
            )

        return JsonResponse({"message": "تم حفظ الفاتورة في قاعدة البيانات ✅"})

    elif request.method == "GET":
        receipts = Receipt.objects.filter(user=request.user)
        result = []
        for r in receipts:
            customer = {
                "first_name": r.customer.first_name,
                "last_name": r.customer.last_name,
                "birthdate": str(r.customer.birthdate),
                "gender": r.customer.gender,
                "join_date": str(r.customer.join_date),
                "local_id": r.customer.local_id
            }

            items = [
                {
                    "id": i.id,
                    "product_name": i.product_name,
                    "price": i.price,
                    "tax": i.tax,
                    "discount": i.discount,
                    "category": i.category,
                    "count": i.count,
                    "total": i.total
                } for i in r.items.all()
            ]

            result.append({
                'id': r.id,
                "date": r.date_created.strftime("%Y-%m-%d %H:%M"),
                "customer": customer,
                "items": items
            })

        return JsonResponse({"receipts": result}, safe=False)
   

@login_required
@csrf_exempt
def currency_view(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            value = data.get("value")
            if value not in ["dollar", "other"]:
                return JsonResponse({"error": "قيمة غير صالحة"})

            # حذف أي صف موجود مسبقًا لنفس المستخدم واسم currency
            CurrencySetting.objects.filter(user=request.user, name="currency").delete()

            # الآن أنشئ الصف الجديد بأمان
            CurrencySetting.objects.create(
                user=request.user,
                name="currency",
                value=value
            )

            return JsonResponse({"message": f"تم حفظ العملة: {value}"})

        elif request.method == "GET":
            currency = CurrencySetting.objects.filter(user=request.user, name="currency").first()
            return JsonResponse({"value": currency.value if currency else "dollar"})

        return JsonResponse({"error": "الطريقة غير صحيحة"})
    
    except Exception as e:
        print("=== ERROR ===", str(e))
        return JsonResponse({"error": str(e)})


@login_required(login_url='login')
def sections(request):
    if request.method == 'POST':
        form = SectionForm(request.POST)
        if form.is_valid():
            section = form.save(commit=False)  # لا نحفظ مباشرة
            section.user = request.user       # ربط القسم بالمستخدم الحالي
            section.save()                    # الآن نحفظه
            return redirect('sections')
    else:
        form = SectionForm()

    sections_data = Section.objects.filter(user=request.user)
    context = {
        'sections': sections_data,
        'form': form
    }
    return render(request, 'pages/sections.html', context)

@login_required(login_url='login')
def delete_section(request, id):
    Section.objects.filter(id=id, user=request.user).delete()
    return redirect('sections')

@login_required(login_url='login')
def update_section(request, id):
    section = get_object_or_404(Section, id=id, user=request.user)
    
    if request.method == 'POST':
        form = SectionForm(request.POST, instance=section)
        if form.is_valid():
            form.save()
            return redirect('sections')
            
    else:
        form = SectionForm(instance=section)
            
    sections = Section.objects.filter(user=request.user)
    context = {
        'form': form,
        'sections': sections,
        'update_id': id,
        'is_update': True,
    }
    return render(request, 'pages/sections.html', context)

@login_required(login_url='login')
def section_api(request):
    section = list(Section.objects.filter(user=request.user).values())
    return JsonResponse(section, safe=False)


current_currency = 'dollar'
@login_required(login_url='login')
def currency_view(request):
    # نقرأ عملة المستخدم
    currency = Currency.objects.filter(user=request.user).first()

    if request.method == "GET":
        # إعادة القيمة الحالية
        return JsonResponse({"value": currency.shortcut})

    if request.method == "POST":
        # تبديل القيمة
        new_value = "dollar" if currency.shortcut != "dollar" else "other"

        # تحديث قاعدة البيانات
        currency.shortcut = new_value
        currency.save()

        return JsonResponse({"value": new_value})

    return JsonResponse({"error": "Invalid request method"}, status=400)


@login_required(login_url='login')
def add_product(request, section_name, id):
    section = get_object_or_404(Section, id=id, user=request.user)
    
    if request.method == 'POST':
        product_name = request.POST.get('product_name') or '-'
        product_buy = request.POST.get('product_buy') or 0
        product_sell = request.POST.get('product_sell') or 0
        product_tax = request.POST.get('product_tax') or 0
        product_category = request.POST.get('product_category') or '-'
        product_count = request.POST.get('product_count') or 1

        Add_Product.objects.create(
            section=section,
            product_name=product_name,
            product_buy=product_buy,
            product_sell=product_sell,
            product_tax=product_tax,
            product_category=product_category,
            product_count=product_count,
            user=request.user,
        )
        

        return redirect('add_product', section_name=section_name, id=section.id)

    products = section.products.all()
    
    form = AddProductForm()
    
    return render(request, 'pages/add_product.html', {
        'section': section,
        'products': products,
        'form': form,
        'section_name': section_name,
    })

@login_required(login_url='login')
def delete_product(request, product_id, section_id):
    product = get_object_or_404(Add_Product, id=product_id, user=request.user)
    product.delete()
    
    section = get_object_or_404(Section, id=section_id, user=request.user)
    
    return redirect('add_product', section_name=section.section_name, id=section_id)

@login_required(login_url='login')
def update_product(request, product_id, section_id):
    section = get_object_or_404(Section, id=section_id, user=request.user)
    products = section.products.all()
    product = section.products.get(id=product_id)
    
    if request.method == 'POST':
        form = AddProductForm(request.POST, instance=product)
        if form.is_valid():
            form.save()
        else:
            form = AddProductForm(instance=product)
        return redirect('add_product', section_name=section.section_name, id=section_id)
    
    
    form =  AddProductForm(instance=product)
    return render(request, 'pages/add_product.html', {'form': form, 'products': products, 'section': section, 'is_update': True})

@login_required(login_url='login')
def products_api(request):
    products = list(Add_Product.objects.filter(user=request.user).values())
    return JsonResponse(products, safe=False)


@login_required(login_url='login')
def statisitics(request):
    x = {'home': 'myhome'}
    return render(request, 'pages/statisitics.html', x)


@login_required(login_url='login')
def averges(request, id):
    return render(request, 'pages/averges.html', {})


def login_view(request):
    # إذا المستخدم غير مسجّل دخول، نمسح كل الرسائل القديمة
    if not request.user.is_authenticated:
        storage = messages.get_messages(request)
        storage.used = True

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, 'Log in successfully ✅')
            return redirect('home')
        else:
            messages.error(request, 'Incorrect password or username ❌')
    
    return render(request, 'pages/login.html')


def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            
            # إنشاء البروفايل مع الحقول الإضافية
            Profile.objects.create(
                user=user,
                image=form.cleaned_data.get("image"),
                background=form.cleaned_data.get("background"),
                gender=form.cleaned_data.get("gender"),
                birthdate=form.cleaned_data.get("birthdate"),
                market_name=form.cleaned_data.get("market_name"),
                first_name=form.cleaned_data.get("first_name"),
                last_name=form.cleaned_data.get("last_name"),
            )
            
            messages.success(request, "create account successfully ✅")
            return redirect('login')
        else:
            messages.error(request, "Error in inputes ❌")
    else:
        form = SignUpForm()
    return render(request, 'pages/signup.html', {'form': form})


@login_required(login_url='login')
def logout_view(request):
    # مسح أي رسائل قديمة
    storage = messages.get_messages(request)
    storage.used = True

    logout(request)
    messages.success(request, "Log out successfully ✅")
    return redirect('login')


@login_required(login_url='login')
def admin(request):
    form = AdminForm()
    if request.method == 'POST':
        form = AdminForm(request.POST)
        if form.is_valid():
            admin_obj = form.save(commit=False)  # إنشاء الكائن مؤقتاً دون الحفظ
            admin_obj.user = request.user        # ربطه بالمستخدم الحالي
            admin_obj.save()
            return redirect('admin')
        
    admins = Admin.objects.filter(user=request.user)
    return render(request, 'pages/admin.html', {'form': form, 'admins': admins})

@login_required(login_url='login')
def delete_admin(request, id):  
    Admin.objects.filter(id=id, user=request.user).delete()
    return redirect('admin')

@login_required(login_url='login')
def delete_all_admin(request):
    Admin.objects.filter(user=request.user).delete()
    return redirect('admin')

@login_required(login_url='login') 
def update_admin(request, id): 
    admin = get_object_or_404(Admin, id=id, user=request.user)
    
    if request.method == 'POST':
        form = AdminForm(request.POST, instance=admin)
        if form.is_valid():
            form.save()
            return redirect('admin')
    else:
        form = AdminForm(instance=admin)

    admins = Admin.objects.filter(user=request.user)
    context = {
        'form': form,
        'admins': admins,
        'update_id': id,
        'is_update': True
    }
    return render(request, 'pages/admin.html', context)

@login_required(login_url='login')
def admin_api(request):
    admin = list(Admin.objects.filter(user=request.user).values())
    return JsonResponse(admin, safe=False)
    

@login_required(login_url='login')
def customer(request):
    form = CustomerForm()
    if request.method == 'POST':
        form = CustomerForm(request.POST)
        if form.is_valid():
            # حفظ البيانات وربط العميل بالمستخدم الحالي
            customer = form.save(commit=False)
            customer.user = request.user
            customer.save()
            return redirect('customer')
            
    customers = Customer.objects.filter(user=request.user)        
    return render(request, 'pages/customer.html', {'form': form, 'customers': customers})

@login_required(login_url='login')
def delete_customer(request, id):
    Customer.objects.filter(id=id, user=request.user).delete()
    return redirect('customer')

@login_required(login_url='login')
def update_customer(request, id):
    customer = get_object_or_404(Customer, id=id, user=request.user)
    
    if request.method == 'POST':
        form = CustomerForm(request.POST, instance=customer)
        if form.is_valid():
            form.save()
            return redirect('customer')
    else:
        form = CustomerForm(instance=customer)
        
    customers = Customer.objects.filter(user=request.user)
    context = {
        'form': form,
        'customers': customers,
        'update_id': id,
        'is_update': True
    }
    return render(request, 'pages/customer.html', context)

@login_required(login_url='login')
def delete_all_customers(request):
    first_customer = Customer.objects.first()  # الحصول على أول كائن
    if first_customer:
        # حذف كل الكائنات ما عدا الأول
        Customer.objects.exclude(id=first_customer.id).delete()
    return redirect('customer')

@login_required(login_url='login')
def customers_api(request):
    # تحقق من وجود عملاء للمستخدم الحالي
    if not Customer.objects.filter(user=request.user).exists():
        Customer.objects.create(
            first_name='null',
            last_name='-',
            birthdate='2000-10-10',
            gender='male',
            user=request.user
        )
    
    customers = list(Customer.objects.filter(user=request.user).values())
    return JsonResponse(customers, safe=False)


CURRENCIES = [
        {'currency_symbol': '$', 'currency_country': 'Australia', 'currency_shortcut': 'AUD', 'currency_value_per_usd': 1.68},
        {'currency_symbol': 'R$', 'currency_country': 'Brazil', 'currency_shortcut': 'BRL', 'currency_value_per_usd': 4.92},
        {'currency_symbol': '$', 'currency_country': 'Canada', 'currency_shortcut': 'CAD', 'currency_value_per_usd': 1.37},
        {'currency_symbol': 'ج.م', 'currency_country': 'Egypt', 'currency_shortcut': 'EGP', 'currency_value_per_usd': 30.9},
        {'currency_symbol': '€', 'currency_country': 'France', 'currency_shortcut': 'EUR', 'currency_value_per_usd': 0.93},
        {'currency_symbol': '€', 'currency_country': 'Germany', 'currency_shortcut': 'EUR', 'currency_value_per_usd': 0.93},
        {'currency_symbol': 'د.ع', 'currency_country': 'Iraq', 'currency_shortcut': 'IQD', 'currency_value_per_usd': 1460.0},
        {'currency_symbol': '₹', 'currency_country': 'India', 'currency_shortcut': 'INR', 'currency_value_per_usd': 83.1},
        {'currency_symbol': '¥', 'currency_country': 'Japan', 'currency_shortcut': 'JPY', 'currency_value_per_usd': 150},
        {'currency_symbol': 'د.ك', 'currency_country': 'Kuwait', 'currency_shortcut': 'KWD', 'currency_value_per_usd': 0.31},
        {'currency_symbol': '₩', 'currency_country': 'South Korea', 'currency_shortcut': 'KRW', 'currency_value_per_usd': 1370.0},
        {'currency_symbol': 'ل.ل', 'currency_country': 'Lebanon', 'currency_shortcut': 'LBP', 'currency_value_per_usd': 89500.0},
        {'currency_symbol': 'MX$', 'currency_country': 'Mexico', 'currency_shortcut': 'MXN', 'currency_value_per_usd': 18.2},
        {'currency_symbol': 'د.م', 'currency_country': 'Morocco', 'currency_shortcut': 'MAD', 'currency_value_per_usd': 9.8},
        {'currency_symbol': '₦', 'currency_country': 'Nigeria', 'currency_shortcut': 'NGN', 'currency_value_per_usd': 1500.0},
        {'currency_symbol': 'ر.ع', 'currency_country': 'Oman', 'currency_shortcut': 'OMR', 'currency_value_per_usd': 0.38},
        {'currency_symbol': 'ر.ق', 'currency_country': 'Qatar', 'currency_shortcut': 'QAR', 'currency_value_per_usd': 3.64},
        {'currency_symbol': '£', 'currency_country': 'United Kingdom', 'currency_shortcut': 'GBP', 'currency_value_per_usd': 0.79},
        {'currency_symbol': '﷼', 'currency_country': 'Saudi Arabia', 'currency_shortcut': 'SAR', 'currency_value_per_usd': 3.75},
        {'currency_symbol': '$', 'currency_country': 'Singapore', 'currency_shortcut': 'SGD', 'currency_value_per_usd': 1.36},
        {'currency_symbol': '₽', 'currency_country': 'Russia', 'currency_shortcut': 'RUB', 'currency_value_per_usd': 94.0},
        {'currency_symbol': '$', 'currency_country': 'United States', 'currency_shortcut': 'USD', 'currency_value_per_usd': 1},
        {'currency_symbol': '₺', 'currency_country': 'Turkey', 'currency_shortcut': 'TRY', 'currency_value_per_usd': 34.0},
        {'currency_symbol': 'ل.س', 'currency_country': 'Syria', 'currency_shortcut': 'SYP', 'currency_value_per_usd': 14500},
        {'currency_symbol': 'د.ت', 'currency_country': 'Tunisia', 'currency_shortcut': 'TND', 'currency_value_per_usd': 3.15},
        {'currency_symbol': 'د.إ', 'currency_country': 'United Arab Emirates', 'currency_shortcut': 'AED', 'currency_value_per_usd': 3.67},
        {'currency_symbol': 'ZAR', 'currency_country': 'South Africa', 'currency_shortcut': 'ZAR', 'currency_value_per_usd': 18.1},
        {'currency_symbol': 'د.س', 'currency_country': 'Sudan', 'currency_shortcut': 'SDG', 'currency_value_per_usd': 600.0},
        {'currency_symbol': 'د.ع', 'currency_country': 'Jordan', 'currency_shortcut': 'JOD', 'currency_value_per_usd': 0.71},
        {'currency_symbol': 'د.م', 'currency_country': 'Tunisia', 'currency_shortcut': 'TND', 'currency_value_per_usd': 3.15},
        ],

@login_required(login_url='login')
def currency(request):
    context = {
        'currencies': CURRENCIES,
        'currency_value': Currency.objects.first().value_per_usd if Currency.objects.exists() else '',  
        'currency_symbol': Currency.objects.first().symbol if Currency.objects.exists() else ''       
        }
    return render(request, 'pages/currency.html', context)

@login_required(login_url='login')
def save_currency(request, id):
    currency_id = id
    
    currencies = [
        ['$','Australia', 'AUD', 1.68],
        ['R$','Brazil', 'BRL', 4.92],
        ['$','Canada', 'CAD', 1.37],
        ['ج.م','Egypt', 'EGP', 30.9],
        ['€','France', 'EUR', 0.93],
        ['€','Germany', 'EUR', 0.93],
        ['د.ع','Iraq', 'IQD', 1460.0],
        ['₹','India', 'INR', 83.1],
        ['¥','Japan', 'JPY', 150],
        ['د.ك','Kuwait', 'KWD', 0.31],
        ['₩','South Korea', 'KRW', 1370.0],
        ['ل.ل','Lebanon', 'LBP', 89500.0],
        ['MX$','Mexico', 'MXN', 18.2],
        ['د.م','Morocco', 'MAD', 9.8],
        ['₦','Nigeria', 'NGN', 1500.0],
        ['ر.ع','Oman', 'OMR', 0.38],
        ['ر.ق','Qatar', 'QAR', 3.64],
        ['£','United Kingdom', 'GBP', 0.79],
        ['﷼','Saudi Arabia', 'SAR', 3.75],
        ['$','Singapore', 'SGD', 1.36],
        ['₽','Russia', 'RUB', 94.0],
        ['$','United States', 'USD', 1],
        ['₺','Turkey', 'TRY', 34.0],
        ['ل.س','Syria', 'SYP', 14500],
        ['د.ت','Tunisia', 'TND', 3.15],
        ['د.إ','United Arab Emirates', 'AED', 3.67],
        ['ZAR','South Africa', 'ZAR', 18.1],
        ['د.س','Sudan', 'SDG', 600.0],
        ['د.ع','Jordan', 'JOD', 0.71],
        ['د.م','Tunisia', 'TND', 3.15],
    ]
    
    if currency_id is not None:
        Currency.objects.filter(user=request.user).delete()
    
        Currency.objects.create(
        symbol=currencies[currency_id][0],
        country=currencies[currency_id][1],
        shortcut=currencies[currency_id][2],
        value_per_usd=currencies[currency_id][3],
        user=request.user,
    )
        

    return redirect('currency')

@login_required(login_url='login')
def update_currency_value(request):
    if request.method == 'POST':
        
        new_value = request.POST.get('new_value') 
        
        currency = Currency.objects.filter(user=request.user).first()
        currency.value_per_usd = new_value
        
        currency.save()
    return redirect('currency')

@login_required(login_url='login')
def currency_api(request):
    # تحقق من وجود عملة للمستخدم
    if not Currency.objects.filter(user=request.user).exists():
        # إذا لم يوجد، ضع عملة افتراضية
        Currency.objects.create(
            symbol='$',
            country='United States',
            shortcut='USD',
            value_per_usd=1,
            user=request.user
        )

    all_data = {
        'current_currency': list(Currency.objects.filter(user=request.user).values()),
        'currencies': CURRENCIES,
    }
   
    return JsonResponse(all_data, safe=False)



@receiver(post_save, sender=User)
def create_default_currency(sender, instance, created, **kwargs):
    if created:
        Currency.objects.create(
            symbol='$',
            country='United States',
            shortcut='USD',
            value_per_usd=1,
            user=instance
        )
        

@login_required(login_url='login')
def receipts_history(request):
    return render(request, 'pages/recipes_history.html', {})

@login_required(login_url='login')
def receipts_history_delete_all(request):
    ReceiptItem.objects.filter(user=request.user).delete()
    Receipt.objects.filter(user=request.user).delete()
    CustomerReceipt.objects.filter(user=request.user).delete()
        
    return redirect('/regmarket/receipts_history/')

@login_required(login_url='login')
def receipts_history_delete_day(request, date_str):
    """
    date_str يجب أن يكون بالشكل "YYYY-MM-DD"
    مثال: "2025-11-10"
    """

    # جلب كل الإيصالات التي تساوي اليوم المطلوب
    receipts_to_delete = Receipt.objects.filter(date_created__date=date_str, user=request.user)

    # حذف كل العناصر المرتبطة بهذه الإيصالات
    ReceiptItem.objects.filter(receipt__in=receipts_to_delete, user=request.user).delete()

    # حذف الإيصالات نفسها
    receipts_to_delete.delete()

    # لو تريد أيضًا حذف العملاء المرتبطين؟ عادة لا نحذفهم إلا إذا كنت متأكد
    # CustomerReceipt.objects.filter(receipt__in=receipts_to_delete, user=request=user).delete()

    return redirect('/regmarket/receipts_history/')


@login_required(login_url='login')
def current_receipts(request, id):
    return render(request, 'pages/current_recipes.html', {})

@login_required(login_url='login')
def delete_current_receipts(request, dayIndex, receipt_id):
    # حذف الفاتورة المطلوبة
    receipt = get_object_or_404(Receipt, id=receipt_id, user=request.user)
    receipt.delete()

    # بعد الحذف نرجع لنفس اليوم
    return redirect(f'/regmarket/current_receipts/{dayIndex}/')


@login_required(login_url='login')
def see_receipt(request, dayIndex, receiptId):
    form = SeeReceiptForm()
    context = {
        'form': form,
        'dayIndex': dayIndex,
    }
    
    return render(request, 'pages/see_recipe.html', context)

@login_required(login_url='login')
def update_see_receipt(request, dayIndex, SectionId, Id):
    seeReceipt = get_object_or_404(ReceiptItem, id=Id, user=request.user)
    
    if request.method == 'POST':
        form = SeeReceiptForm(request.POST, instance=seeReceipt)
        if form.is_valid():
            obj = form.save(commit=False)

            obj.save()
            form.save()
            
            return redirect(f'/regmarket/see_receipt/{dayIndex}/{SectionId}/')
            # هنا يمكن عمل إعادة توجيه بعد التحديث
        
    else:
        form = SeeReceiptForm(instance=seeReceipt)
    
    context = {
        'form': form
    }
    
    return render(request, 'pages/see_recipe.html', context)

@login_required(login_url='login')
def delete_see_receipt(request, dayIndex, SectionId, Id):
    seeReceipt = get_object_or_404(ReceiptItem, id=Id, user=request.user)
    seeReceipt.delete()


def terms_view(request):
    return render(request, 'pages/terms.html')

def privacy_policy_view(request):
    return render(request, 'pages/privacy_policy.html')

@login_required(login_url='login')
def profile(request):
    profile_data = profile_data = Profile.objects.get(user=request.user)
    context = {
        'profile': profile_data,
    }
    return render(request, 'pages/profile.html', context)