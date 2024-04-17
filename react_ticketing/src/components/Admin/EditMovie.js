import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import Select from "react-select";
import { checkAdmin } from "../Authentication/checkAdmin";

function EditMovie() {
  const { postId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [availability, setAvailability] = useState(false);
  const [price, setPrice] = useState("");
  const [trailer, setTrailer] = useState("");
  const [showTime, setShowTime] = useState([]);

  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  const fixedShowTimeOptions = [
    { value: "11:30", label: "11:30 AM" },
    { value: "14:30", label: "2:30 PM" },
    { value: "17:00", label: "5:00 PM" },
    { value: "21:00", label: "9:00 PM" },
  ];

  useEffect(() => {
    if (user && user.token) {
      axios
        .get(`http://127.0.0.1:8000/api/listsingle/${postId}/`, {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        })
        .then((response) => {
          setTitle(response.data.title);
          setDescription(response.data.description);
          setPoster(response.data.poster);
          setGenre(response.data.genre);
          setReleaseDate(response.data.release_date);
          setAvailability(response.data.availability);
          setTrailer(response.data.trailer);
          setPrice(response.data.price);
          setShowTime(
            response.data.show_time.map((time) => ({
              value: time,
              label: `${time} AM`,
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching movie:", error);
        });
    }
  }, [postId, user]);

  function updateMovie() {
    axios
      .put(
        `http://127.0.0.1:8000/api/update/${postId}/`,
        {
          title: title,
          description: description,
          setPoster: poster,
          genre: genre,
          release_date: releaseDate,
          availability: availability,
          price: price,
          trailer: trailer,
          show_time: showTime.map((time) => time.value),
        },
        {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        }
      )
      .then((response) => {
        navigate("/admin/dashboard");
      })
      .catch((error) => {
        console.error("Error updating movie:", error);
      });
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-8 offset-2">
            <h1 className="text-center">Edit Movie</h1>
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
                type="text"
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
                type="text"
                className="form-control"
                value={releaseDate}
                onChange={(event) => {
                  setReleaseDate(event.target.value);
                }}
                pattern="\d{4}-\d{2}-\d{2}"
                placeholder="YYYY-MM-DD"
                title="Enter a date in the format YYYY-MM-DD"
              />
            </div>
            <br />
            <div className="form-group">
              <label>Availability :</label>&nbsp;
              <input
                type="checkbox"
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
                type="number"
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
                options={fixedShowTimeOptions}
                value={showTime}
                onChange={setShowTime}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <br />
            <div className="text-center">
              <button className="btn btn-primary" onClick={updateMovie}>
                Submit
              </button>
              &nbsp;&nbsp;&nbsp;
              <Link to={"/admin/dashboard"} className="btn btn-warning">
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default checkAdmin(EditMovie);
