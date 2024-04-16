import { useSelector } from "react-redux";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import "./YourBookings.css";
import checkAuth from "../Authentication/checkAuth";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [movieTitles, setMovieTitles] = useState({});
  const [moviePoster, setMoviePoster] = useState({});
  const [qrCodes, setQrCodes] = useState({});
  const user = useSelector((store) => store.auth.user);

  // Function to convert time from 24-hour format to 12-hour format
  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    let period = "AM";
    let hour = parseInt(hours, 10);
    if (hour >= 12) {
      period = "PM";
      hour = hour === 12 ? hour : hour - 12;
    }
    return `${hour}:${minutes} ${period}`;
  };

  const fetchQRCodes = useCallback(async () => {
    const qrCodes = {};
    for (const booking of bookings) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/booking/${booking.id}/qr/`,
          { headers: { Authorization: "Token " + user.token } }
        );
        qrCodes[booking.id] = response.data.qr_image_url;
      } catch (error) {
        console.error("Error fetching QR code:", error);
        qrCodes[booking.id] = null;
      }
    }
    setQrCodes(qrCodes);
  }, [bookings, user]);

  useEffect(() => {
    // Fetch booking details and QR codes
    const fetchMovieDetails = async (movieId) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/listsingle/${movieId}/`,
          { headers: { Authorization: "Token " + user.token } }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
      }
    };

    axios
      .get("http://127.0.0.1:8000/api/user/bookings/", {
        headers: { Authorization: "Token " + user.token },
      })
      .then(async (response) => {
        setBookings(response.data);

        const titles = {};
        const posters = {};
        for (const booking of response.data) {
          const movieId = booking.movie;
          const movieDetails = await fetchMovieDetails(movieId);
          if (movieDetails) {
            titles[movieId] = movieDetails.title;
            posters[movieId] = movieDetails.poster;
          }
        }
        setMovieTitles(titles);
        setMoviePoster((prevPoster) => ({ ...prevPoster, ...posters }));
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  }, [user]);

  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);

  return (
    <div>
      <Navbar />
      <br />
      <h2 className="text-center mt-3">Your Bookings</h2>
      <br />
      {bookings.length === 0 ? (
        <p className="text-center">You haven't booked any tickets yet.</p>
      ) : (
        <ul className="col-14">
          {bookings.map((booking, index) => (
            <li key={index} className="booking-card">
              <div className="movie-poster">
                <div className="movie-title">
                  <h3>{movieTitles[booking.movie]}</h3>
                </div>
                {moviePoster[booking.movie] && (
                  <img
                    src={moviePoster[booking.movie]}
                    alt={movieTitles[booking.movie]}
                  />
                )}
              </div>
              <div className="movie-details">
                <div className="booking-id">
                  <p>
                    Booking ID : <strong>#{booking.id}</strong>
                  </p>
                </div>

                <div className="movie-show-date">
                  <p>Movie Date : {booking.show_date}</p>
                </div>
                <div>
                  <p>Movie Time : {convertTo12HourFormat(booking.booking_time)}</p>
                </div>
                <div className="movie-booking-date">
                  <p>Booking Date : {booking.booking_date}</p>
                </div>
                <div className="ticket-count">
                  <p>Number of Tickets : {booking.quantity}</p>
                </div>
                <div className="seat-numbers">
                  <p>Seats Booked : {booking.seats_booked}</p>
                </div>
                <div className="total-amount">
                  <p>
                    Total Amount : <strong>Rs. {booking.total_price}</strong>
                  </p>
                </div>
              </div>
              <div className="pdf-download">
                <button
                  className="btn btn-outline-dark"
                  onClick={() =>
                    window.open(
                      `http://127.0.0.1:8000/media/booking_pdfs/booking_${booking.id}.pdf`
                    )
                  }
                >
                  Download as PDF
                </button>
              </div>
              <div className="qr-code qr-code-right">
                <p>
                  <b className="me">Scan to find Booking Details</b>
                </p>
                <img
                  src={qrCodes[booking.id]}
                  alt={`QR Code for Booking ID ${booking.id}`}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default checkAuth(MyBookings);
