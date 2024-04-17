from django.contrib.auth import authenticate
from rest_framework import status
from django import forms
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth.forms import UserCreationForm
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from backend.forms import CreateMovieForm
from rest_framework.exceptions import PermissionDenied
from datetime import datetime
from backend.models import BookingRegister
from .serializers import MovieSerializer, Movie, BookingRegisterSerializer
from razorpay import Client as RazorpayClient
from django.template.loader import get_template, render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMessage
from xhtml2pdf import pisa
from io import BytesIO
import qrcode
from django.core.files import File
from django.conf import settings
from django.urls import reverse
from django.core.files.base import ContentFile




# Register a User

class ExtendedUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta(UserCreationForm.Meta):
        fields = UserCreationForm.Meta.fields + ('email',)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    form = ExtendedUserCreationForm(request.data)
    if form.is_valid():
        user = form.save()
        return Response("Account created successfully", status=status.HTTP_201_CREATED)
    else:
        print(form.errors)
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


# Login a User

@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'id': user.id, 'username': user.username, 'token': token.key}, status=HTTP_200_OK)


# User Logout

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    if request.method == 'POST':
        request.user.auth_token.delete()
        return Response({'Message': 'You are logged out'},status=status.HTTP_200_OK)


# Add New Movie

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_movie(request):
    serializer = MovieSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response({'id': instance.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# List Movie

@api_view(['GET'])
@permission_classes([AllowAny])
def list_movie(request):
    products = Movie.objects.all()
    serializer = MovieSerializer(products, many=True)
    return Response(serializer.data)

#List single movie

@api_view(['GET'])
@permission_classes((AllowAny,))
def ReadOne(request, pk):
    try:
        product = Movie.objects.get(pk=pk)
        serializer = MovieSerializer(product)
        return Response(serializer.data)
    except Movie.DoesNotExist:
        return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)



# Update Movie

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_movie(request, pk):
    movie = get_object_or_404(Movie, pk=pk)
    serializer = MovieSerializer(movie, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete Movie
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_movie(request, pk):
    movie = get_object_or_404(Movie, pk=pk)
    movie.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# Search Movie

from datetime import date

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_movie(request, title):
    # Get the current date
    current_date = date.today()
    
    # Get the query parameter for date if provided
    date_param = request.GET.get('date', None)
    if date_param:
        try:
            # Convert date string to date object
            date_filter = datetime.strptime(date_param, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Filter movies by title and show date after the provided date
        movies = Movie.objects.filter(title__istartswith=title, shows__show_date__gte=date_filter)
    else:
        # Filter movies by title and release date before or on the current date
        movies = Movie.objects.filter(title__istartswith=title, release_date__lte=current_date)

    if movies.exists():
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)
    else:
        return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)

    

#  Accept a Booking

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_booking(request, pk):
    movie = get_object_or_404(Movie, pk=pk)
    data = request.data.copy()
    data['movie'] = movie.id
    data['booking_date'] = datetime.now().date()
    serializer = BookingRegisterSerializer(data=data)
    if serializer.is_valid():
        booking = serializer.save()

        # Generate QR code for the booking
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr_data = f"Booking ID : {booking.id}\nMovie : {movie.title}\nDate : {booking.show_date}\nTime : {booking.booking_time}\nSeats : {booking.seats_booked}"
        qr.add_data(qr_data)
        qr.make(fit=True)
        qr_img = BytesIO()
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(qr_img)
        qr_img.seek(0)
        booking.booking_qr.save(f"booking_{booking.id}.png", File(qr_img))


        # Generate PDF for booking
        template = get_template('booking_details.html')
        qr_code_url = booking.booking_qr.url
        context = {'booking_data': booking, 'movie_instance': movie, 'booking_QR': qr_code_url}
        html_content = template.render(context)

        pdf_content = BytesIO()
        pisa.CreatePDF(BytesIO(html_content.encode('UTF-8')), dest=pdf_content)
        booking.booking_pdf.save(f"booking_{booking.id}.pdf", ContentFile(pdf_content.getvalue()))
        
        # Mailing

        subject = 'Booking Confirmation'
        to_email = request.user.email
        from_email = 'karun.cinemate@admin.com'
        email_context = {'booking': booking, 'movie': movie}
        email_body_html = render_to_string('email_template.html', email_context)
        email_body_text = strip_tags(email_body_html)

        email = EmailMessage(
            subject,
            email_body_text,
            from_email,
            [to_email],
        )
        pdf_file_path = booking.booking_pdf.path
        email.attach_file(pdf_file_path, 'application/pdf')

        email.send()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Get QR

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_booking_qr(request, pk):
    booking = get_object_or_404(BookingRegister, pk=pk)
    qr_image_url = request.build_absolute_uri(settings.MEDIA_URL + booking.booking_qr.name)
    return Response({'qr_image_url': qr_image_url})




# Fetching a Single Movie

@api_view(['GET'])
@permission_classes((AllowAny,))
def get_single_movie(request, movie_id):
    movie = Movie.objects.get(id=movie_id)
    serializer = MovieSerializer(movie)
    return Response(serializer.data)


#Razorpay

razorpay_client = RazorpayClient(auth=("rzp_test_WywoaZPJVI7Dfo", "GOlZRG9dce2EsOeRNqKPH9tD"))

@csrf_exempt
@permission_classes((AllowAny,))
def new_payment(request):
    if request.method == "POST":
        try:
            
            price = float(request.POST.get('price', 0))
            product_name = request.POST.get('product_name', '')

           
            amount = int(round(price * 100))  # Convert price to paise (Indian currency)
            new_order_response = razorpay_client.order.create({
                "amount": amount,
                "currency": "INR",
                "payment_capture": "1"
            })

            response_data = {
                "callback_url": "http://127.0.0.1:8000/api/callback/",
                "razorpay_key": "rzp_test_WywoaZPJVI7Dfo",
                "order": new_order_response,
                "product_name": product_name
            }

            return JsonResponse(response_data)

        except Exception as e:
            
            return JsonResponse({'error': str(e)}, status=500)

    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@permission_classes((AllowAny,))
def order_callback(request):
    if request.method == "POST":
        try:
            if "razorpay_signature" in request.POST:
                payment_verification = razorpay_client.utility.verify_payment_signature(request.POST)
                if payment_verification:
                    return JsonResponse({"res": "Success"})
                else:
                    return JsonResponse({"res": "Failed"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    elif request.method == "GET":
        return JsonResponse({"message": "GET request received"})
    return JsonResponse({"error": "Method not allowed"}, status=405)


#Get Previous Booking

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_bookings(request):
    user_bookings = BookingRegister.objects.filter(user=request.user)
    serializer = BookingRegisterSerializer(user_bookings, many=True)
    return Response(serializer.data)


