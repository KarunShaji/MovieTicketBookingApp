import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import MovieListUser from "./MovieListUser";
import checkAuth from "../Authentication/checkAuth";

function ListMoviesUser() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [noMoviesFound, setNoMoviesFound] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        let apiUrl = "http://127.0.0.1:8000/api/list/";
        if (searchQuery.trim() !== "") {
          apiUrl = `http://127.0.0.1:8000/api/search/${searchQuery}/`;
        }
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Token ${user.token}`,
          },
        });
        setMovies(response.data);
        setNoMoviesFound(response.status === 404 || response.data.length === 0);
      } catch (error) {
        setNoMoviesFound(true);
      }
    };

    if (user && user.token) {
      fetchMovies();
    }
  }, [searchQuery, user]);

  return (
    <div>
      <Navbar />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <input
              className="form-control"
              type="text"
              placeholder="Search your movies here..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
            />
          </div>
        </div>
        {noMoviesFound && (
          <div className="row">
            <div className="text-center col-12 mt-5">
              <h2>No movies found</h2>
            </div>
          </div>
        )}
        {!noMoviesFound && (
          <>
            <div className="row">
              <div className="col-12">
                <h1
                  className="text-center my-4"
                  style={{
                    fontSize: "60px",
                    fontWeight: 500,
                    backgroundImage:
                      "linear-gradient(to left, #A230ED, #190087)",
                    color: "transparent",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                  }}
                >
                  Book your Shows Here!!
                </h1>
              </div>
            </div>
            <div className="d-flex flex-wrap">
              {movies.map((movie) => (
                <Link
                  to={`/view/${movie.id}`}
                  key={movie.id}
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  <div>
                    <MovieListUser movie={movie} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default checkAuth(ListMoviesUser);
