from django.urls import path
from . import views


urlpatterns = [
    path('home/', views.home, name='home'),
    path('api/receipts/', views.receipts_view, name='create_receipt'),
    path('api/currency_mode/', views.currency_view, name='currency_views'),
    
    
    path('peoples/', views.peoples, name='peoples'),
    
    
    path('sections/', views.sections, name='sections'),
    path('sections/delete_section/<int:id>', views.delete_section, name='delete_section'),
    path('sections/update_section/<int:id>', views.update_section, name='update_section'),
    path('api/sections/', views.section_api, name='api_section'),
    
    
    path('statisitics/', views.statisitics, name='statisitics'),
    path('statisitics/averges/<int:id>/', views.averges, name='averges'),
    
    
    path('settings/', views.settings, name='settings'),
    
    
    path('login/', views.login_view, name='login'),
    
    
    path('logout/', views.logout_view, name='logout'),
    
    
    path('signup/', views.signup_view, name='signup'),
    
    
    
    path('add_product/<str:section_name>/<int:id>/', views.add_product, name='add_product'),
    path('delete_product/<int:product_id>/<int:section_id>/', views.delete_product, name='delete_product'),
    path('update_product/<int:product_id>/<int:section_id>/', views.update_product, name='update_product'),
    path('api/products/', views.products_api, name='products_api'),
    
    
    path('admin/', views.admin, name='admin'),
    path('admin/delete_admin/<int:id>/', views.delete_admin, name='delete_admin'),
    path('admin/delete_all/', views.delete_all_admin, name='delete_all_admin'),
    path('admin/update_admin/<int:id>/', views.update_admin, name='update_admin'),
    path('api/admin/', views.admin_api, name='admin_api'),
    
    
    path('customer/', views.customer, name='customer'),
    path('customer/delete_customer/<int:id>/', views.delete_customer, name='delete_customer'),
    path('customer/update_customer/<int:id>/', views.update_customer, name='update_customer'),
    path('customer/delete_all', views.delete_all_customers, name='delete_all_customers'),
    path('api/customers/', views.customers_api, name='customers_api'),
    
    
    path('currency/', views.currency, name='currency'),
    path('save_currency/<int:id>/', views.save_currency, name='save_currency'),
    path('update_currency_value/', views.update_currency_value, name='update_currency_value'),
    path('api/currency/', views.currency_api, name='currency_api'),
    
    
    path('receipts_history/', views.receipts_history, name='receipts_history'),
    path('receipts_history/delete_all/', views.receipts_history_delete_all, name='receipts_history_delete_all'),
    path('receipts_history_delete_day/<str:date_str>/', views.receipts_history_delete_day, name='receipts_history_delete_day'),
    
    
    path('current_receipts/<int:id>/', views.current_receipts, name='current_receipts'),
    path('current_receipts/<int:dayIndex>/delete/<int:receipt_id>/', views.delete_current_receipts, name='delete_current_receipts'),
    
    
    path('see_receipt/<int:dayIndex>/<int:receiptId>/', views.see_receipt, name='see_receipt'),
    path('see_receipt/<int:dayIndex>/<int:SectionId>/update/<int:Id>/', views.update_see_receipt, name='update_see_receipt'),
    path('see_receipt/<int:dayIndex>/<int:SectionId>/delete/<int:Id>/', views.delete_see_receipt, name='delete_see_receipt'),


    path('terms/', views.terms_view, name='terms'),
    path('privacy_policy/', views.privacy_policy_view, name='privacy_policy'),
    
    
    path('profile/', views.profile, name='profile'),

]