from rest_framework import serializers
from .models import Movie, BookingRegister

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['id','title','description','poster','genre','release_date','availability','trailer','price','show_time']

class BookingRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingRegister
        fields = ['user','movie','booking_date','booking_time','quantity','seats_booked','show_date','id','booking_id','total_price']


