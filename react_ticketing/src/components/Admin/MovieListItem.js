import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./MovieListItem.css";
import { checkAdmin } from "../Authentication/checkAdmin";

function MovieListItem({ movie, refresh, title, poster }) {
  const user = useSelector((state) => state.auth.user);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/delete/${movie.id}/`, {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      })
      .then((response) => {
        refresh();
        setShowModal(false); // Close the modal after successful deletion
      })
      .catch((error) => {
        console.error("Error deleting Movie:", error);
      });
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="movie">
        <div className="heading">
          <h2>{title}</h2>
        </div>
        <div className="photo">
          <img
            src={
              movie.poster !== "N/A"
                ? movie.poster
                : "https://via.placeholder.com/400"
            }
            alt={movie.Title}
          />
        </div>
        <div className="button text-center">
          <Link to={`/admin/edit/${movie.id}`} className="btn btn-primary edit">
            Edit
          </Link>
          <button className="btn btn-danger delete" onClick={openModal}>
            Delete
          </button>
        </div>
      </div>
      <br />

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this movie?</p>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default checkAdmin(MovieListItem);
