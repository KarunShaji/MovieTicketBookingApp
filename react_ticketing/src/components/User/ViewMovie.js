import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../Navbar";
import checkAuth from "../Authentication/checkAuth";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ViewMovie.css";

function ViewMovie() {
  const { postId } = useParams();
  const [post, setPost] = useState({
    title: "",
    description: "",
    poster: "",
    genre: "",
    release_date: "",
    availability: "",
    price: "",
    show_time: "",
    trailer: "",
  });
  const [numTickets, setNumTickets] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showDate, setShowDate] = useState("");
  const [minShowDate, setMinShowDate] = useState("");
  const [dateError, setDateError] = useState(false);
  const [selectedShowTime, setSelectedShowTime] = useState("");
  const user = useSelector((state) => state.auth.user);
  const userId = user.userId;

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/listsingle/${postId}/`,
          {
            headers: {
              Authorization: `Token ${user.token}`,
            },
          }
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };

    fetchMovieData();
  }, [postId, user?.token]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const pricePerTicket = parseFloat(post.price);
      setTotalPrice(pricePerTicket * numTickets);
    };

    calculateTotalPrice();
  }, [numTickets, post.price]);

  useEffect(() => {
    if (post.release_date) {
      const releaseDate = new Date(post.release_date);
      releaseDate.setDate(releaseDate.getDate() + 1);
      setMinShowDate(releaseDate.toISOString().split("T")[0]);
    }
  }, [post.release_date]);

  const generateBookingId = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const handleBooking = async () => {
    if (!showDate) {
      setDateError(true);
      return;
    }

    const bookingData = {
      booking_id: generateBookingId(),
      user: userId,
      movie: postId,
      booking_date: new Date().toISOString().split("T")[0],
      booking_time: selectedShowTime,
      quantity: numTickets,
      seats_booked: generateSeats(numTickets),
      show_date: showDate,
      total_price: totalPrice,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/booking/${postId}/`,
        bookingData,
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );
      console.log("Booking created successfully:", response.data);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const generateSeats = (numTickets) => {
    let seats = [];
    for (let i = 1; i <= numTickets; i++) {
      seats.push(`PRIME ${i}`);
    }
    return seats.join(", ");
  };

  // RazorPay

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const makePayment = async () => {
    const formData = new FormData();
    formData.append("price", totalPrice);
    formData.append("product_name", post.title);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/new-payment/",
        formData,
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      );

      const res = response.data;
      const options = {
        key: res.razorpay_key,
        amount: res.order.amount,
        currency: res.order.currency,
        callback_url: res.callback_url,
        prefill: {
          email: "testemail@test.com",
          contact: "123456789000",
        },
        name: res.product_name,
        order_id: res.order.id,
        handler: function (response) {
          handleBooking();
          const bookingId = response.razorpay_order_id;
          const modal = document.createElement("div");
          modal.className = "modal";
          modal.innerHTML = `<div class="modal-content">
                                <span class="close">
                                  <button class="btn btn-danger">X</button>
                                </span>
                                <h2>Booking Confirmed</h2>
                                <p>Your Order ID is: ${bookingId}</p>
                              </div>`;
          document.body.appendChild(modal);

          modal.querySelector(".close").addEventListener("click", function () {
            document.body.removeChild(modal);
            window.location.href = "/dashboard";
          });
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedTime = `${displayHours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${period}`;
    return formattedTime;
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid fullbody">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card">
              <div className="card-header text-center bg-info text-white">
                <h3>{post.title}</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-5">
                    <Slider dots={true}>
                      <img src={post.poster} alt={post.title} />
                      {post.trailer && (
                        <iframe
                          title="YouTube Trailer"
                          width="560px"
                          height="450px"
                          src={post.trailer}
                          frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      )}
                    </Slider>
                  </div>

                  <div className="col-md-7">
                    <p>{post.description}</p>
                    <div className="static">
                      <p>
                        <strong>Genre :</strong> {post.genre}
                      </p>
                      <p>
                        <strong>Release Date :</strong> {post.release_date}
                      </p>
                      <p>
                        <strong>Availability :</strong>{" "}
                        {post.availability ? "Yes" : "Not available"}
                      </p>
                      <p>
                        <strong>Price :</strong> {post.price}
                      </p>

                      <div className="show-time-container">
                        <label>
                          <strong>Show&nbsp;Time&nbsp;:&nbsp;</strong>
                        </label>
                        <select
                          id="show-time"
                          className="form-control"
                          value={selectedShowTime}
                          onChange={(e) => setSelectedShowTime(e.target.value)}
                        >
                          <option value="" disabled>
                            Select Show Time
                          </option>
                          {Array.isArray(post.show_time) &&
                            post.show_time.map((time) => (
                              <option key={time} value={time}>
                                {convertTo12HourFormat(time)}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <br />
                    {post.availability && (
                      <>
                        <div style={{ display: "flex" }}>
                          <label style={{ paddingTop: "5px" }}>
                            <strong>Show&nbsp;Date&nbsp;:&nbsp;&nbsp;</strong>
                          </label>
                          <input
                            type="date"
                            className={`form-control ${
                              dateError ? "is-invalid" : ""
                            }`}
                            value={showDate}
                            min={minShowDate}
                            onChange={(event) => {
                              setShowDate(event.target.value);
                              setDateError(false);
                            }}
                          />
                          {dateError && (
                            <div className="invalid-feedback">
                              Please select a show date.
                            </div>
                          )}
                        </div>
                        <br />
                        <br />
                        <div className="logic">
                          <div
                            className="btn-group counter"
                            role="group"
                            aria-label="Tickets"
                          >
                            <button
                              className="btn btn-secondary"
                              onClick={() => setNumTickets(numTickets - 1)}
                              disabled={numTickets <= 1}
                            >
                              -
                            </button>
                            <button className="btn btn-light" disabled>
                              {numTickets}
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() => setNumTickets(numTickets + 1)}
                              disabled={numTickets >= 10}
                            >
                              +
                            </button>
                          </div>
                          <p>
                            <strong>Total Price :</strong> Rs.{" "}
                            {totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-footer text-center">
                {post.availability && (
                  <div>
                    <button className="btn btn-info"
                     onClick={makePayment}
                     disabled={!showDate || !selectedShowTime}>
                      Book Tickets
                    </button>
                  </div>
                )}
                {!post.availability && (
                  <button className="btn btn-info" disabled>
                    Movie Not Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default checkAuth(ViewMovie);
