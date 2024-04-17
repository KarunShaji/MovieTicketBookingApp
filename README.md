# CINEMATE: Movie Ticket Booking Website

Welcome to CINEMATE, the movie ticket booking website! This repository contains the source code for an online platform where users can easily book movie tickets for various shows at their favorite theatres.

## Features

### Admin Panel

- **Authentication**: Admins can securely log in to the platform using email and password authentication.
- **Show Management**: Admins have full control over managing movie shows, including adding, editing, and deleting shows.
- **Show Disabling**: Admins can temporarily disable any movie show if needed.

### User Interface

- **User Authentication**: Users can register and log in to the platform to access booking features.
- **Show Listings**: Users can browse through available movie shows for specific dates.
- **Ticket Booking**: Users can select a show and book tickets easily.
- **Payment Integration**: Secure payment processing is facilitated through integration with the Razorpay payment gateway.
- **Booking Confirmation**: Users receive instant confirmation with a unique booking ID after successful booking.
- **Email Notifications**: Users receive email confirmations for their bookings.
- **Booking History**: Users can view their booking history and manage past bookings.
- **Ticket Download**: PDF tickets with show details and a QR code are available for download.
- **QR Code Integration**: Tickets include QR codes for seamless check-in at the theatre.

## Technologies Used

- **Backend Framework**: Django REST Framework
- **Frontend Framework**: React.js
- **Database**: MySQL
- **Payment Gateway**: Razorpay
- **PDF Generation**: Django xhtml2pdf
- **Email Sending**: Django SMTP Email Backend (Integrated with [MailTrap](https://mailtrap.io/))

## Getting Started

To set up the project locally, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory and install dependencies for both the frontend and backend.
3. Set up your MySQL database and configure the backend settings accordingly.
4. Run migrations to create database tables.
5. Start both the frontend and backend servers.
6. Access the application in your web browser and start booking movie tickets!
