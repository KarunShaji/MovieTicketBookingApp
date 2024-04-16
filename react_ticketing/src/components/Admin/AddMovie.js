import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import Select from "react-select";
import { checkAdmin } from "../Authentication/checkAdmin";

function AddMovie() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState("");
  const [genre, setGenre] = useState("");
  const [release_date, setReleaseDate] = useState("");
  const [availability, setAvailability] = useState(false);
  const [price, setPrice] = useState("");
  const [trailer, setTrailer] = useState("");
  const [showTime, setShowTime] = useState("");

  const user = useSelector((store) => store.auth.user);

  var navigate = useNavigate();

  function addMovie() {
    axios
      .post(
        "http://127.0.0.1:8000/api/create/",
        {
          title: title,
          description: description,
          poster: poster,
          genre: genre,
          release_date: release_date,
          availability: availability,
          price: price,
          trailer: trailer,
          show_time: showTime.map((time) => time.value),
        },
        { headers: { Authorization: "Token " + user.token } }
      )
      .then((response) => {
        if (response.data && response.data.message) {
          alert(response.data.message);
        } else {
          alert("Movie added successfully!");
        }
        navigate("/admin/dashboard");
      })
      .catch((error) => {
        if (error.response) {
          alert(`Error: ${error.response.data.error}`);
        } else if (error.request) {
          alert("No response received from the server");
        } else {
          alert("Error setting up the request");
        }
      });
  }

  const showTimeOptions = [
    { value: "11:30", label: "11:30 AM" },
    { value: "14:30", label: "2:30 PM" },
    { value: "17:00", label: "5:00 PM" },
    { value: "21:00", label: "9:00 PM" },
  ];
  return (
    <div>
      <Navbar></Navbar>
      <br />
      <div className="container">
        <div className="row">
          <div className="col-8 offset-2">
            <h1 className="text-center">Add Movie</h1>
            <div className="form-group">
              <label>Title : </label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
              <br />
            </div>
            <div className="form-group">
              <label>Description :</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                rows="5"
              />
            </div>
            <br />
            <div className="form-group">
              <label>Poster URL :</label>
              <input
                type="url"
                className="form-control"
                value={poster}
                onChange={(event) => {
                  setPoster(event.target.value);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Trailer URL :</label>
              <input
                type="url"
                className="form-control"
                value={trailer}
                onChange={(event) => {
                  setTrailer(event.target.value);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Genre :</label>
              <input
                type="text"
                className="form-control"
                value={genre}
                onChange={(event) => {
                  setGenre(event.target.value);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Release Date :</label>
              <input
                type="date"
                className="form-control"
                value={release_date}
                onChange={(event) => {
                  setReleaseDate(event.target.value);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Availability :</label>
              &nbsp;
              <input
                type="checkbox"
                style={{
                  verticalAlign: "middle",
                  marginLeft: "5px",
                  width: "20px",
                  height: "20px",
                  border: "2px solid #333",
                  borderRadius: "4px",
                  outline: "none",
                  cursor: "pointer",
                }}
                checked={availability}
                onChange={(event) => {
                  setAvailability(event.target.checked);
                }}
              />
            </div>

            <br />
            <div className="form-group">
              <label>Price :</label>
              <input
                type="text"
                className="form-control"
                value={price}
                onChange={(event) => {
                  setPrice(event.target.value);
                }}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Show Time :</label>

              <Select
                isMulti
                options={showTimeOptions}
                value={showTime}
                onChange={setShowTime}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <br />
            <div className="text-center">
              <button className="btn btn-primary" onClick={addMovie}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default checkAdmin(AddMovie);
