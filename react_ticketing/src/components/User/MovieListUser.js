import React from "react";
import "./MovieListUser.css";
import checkAuth from "../Authentication/checkAuth";

function MovieListUser({ movie }) {
  return (
    <div className="movie" key={movie.id}>
      <div className="heading">
        <h2>{movie.title}</h2>
      </div>
      <div className="show-date">
        Bookings from :&nbsp;<strong>{movie.release_date}</strong>
      </div>
      <div className="photo">
        <img
          src={
            movie.poster !== "N/A"
              ? movie.poster
              : "https://via.placeholder.com/400"
          }
          alt={movie.title}
        />
      </div>
      <div className="details">
        <div className="price">
          Rs : <b>{movie.price}</b>
        </div>
        <div className="genre-container">
          <div className="genre"><b>{movie.genre}</b></div>
        </div>
      </div>
    </div>
  );
}

export default checkAuth(MovieListUser);
