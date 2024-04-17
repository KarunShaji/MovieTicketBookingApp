# Movie Booking Website

Welcome to the Movie Booking Website repository! This project is designed to provide a platform for users to book movie tickets online for a theatre with multiple shows throughout the day.

## Features

### Admin Panel

- **Authentication**: Admin can log in to the website using email/password authentication.
- **Manage Shows**: Admin can add, edit, and delete movie shows.
- **Disable Shows**: Admin can disable any movie show.

### User Interface

- **User Authentication**: Users can sign in to the website.
- **View Shows**: Users can view all available shows for a specific date.
- **Book Tickets**: Users can click on a show to book tickets.
- **Payment Integration**: Users can make payments via Razorpay payment gateway.
- **Booking Confirmation**: Users receive a confirmation screen with a booking ID after booking.
- **Email Confirmation**: An email is sent to users after booking.
- **View Bookings**: Users can see all their previous bookings on the "My Bookings" page.
- **Download Ticket**: Users can download tickets in PDF format from the "My Bookings" page.
- **QR Code**: Tickets include a QR code containing show details.

## Technologies Used

- **Backend**: Django REST Framework
- **Frontend**: React.js
- **Database**: MySQL
- **Payment Gateway**: Razorpay
- **PDF Generation**: Django xhtml2pdf
- **Email Sending**: Django SMTP Email Backend ([MailTrap](https://mailtrap.io/))

