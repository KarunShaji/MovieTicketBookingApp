from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/',views.signup, name='register'),
    path('login/',views.login, name='login'),
    path('logout/',views.logout, name='logout'),
    path('create/',views.create_movie, name='create'),
    path('list/',views.list_movie, name='list'),
    path('listsingle/<int:pk>/', views.ReadOne, name='listsingle'),
    path('update/<int:pk>/',views.update_movie, name='update'),
    path('delete/<int:pk>/',views.delete_movie, name='delete'),
    path('search/<str:title>/', views.search_movie, name='search'),
    
    
    # Booking

    path('booking/<int:pk>/',views.accept_booking, name='booking'),
    path('callback/',views.order_callback, name='razorpay-callback'),
    path('new-payment/',views.new_payment, name='razorpay-newpayment'),
    path('user/bookings/', views.user_bookings, name='user_bookings'),
    path('booking/<int:pk>/qr/', views.get_booking_qr, name='getqr'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
