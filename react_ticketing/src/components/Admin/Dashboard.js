import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import MovieListItem from "./MovieListItem";
import { checkAdmin } from "../Authentication/checkAdmin";

function ListMovies() {
  const [movies, setMovies] = useState([]);
  const user = useSelector((state) => state.auth.user);

  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/list/", {
        headers: {
          Authorization: `Token ${user.token}`,
        },
      });
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.token) {
      fetchMovies();
    }
  }, [fetchMovies, user]);

  const handleRefresh = () => {
    fetchMovies();
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center my-4">Movie Inventory</h1>
          </div>
        </div>
        <div className="container d-flex justify-content-center align-items-center">
          <Link to="/admin/create" className="btn btn-dark mb-4">
            Add Movie
          </Link>
        </div>
        <div className="d-flex flex-wrap">
          {movies.map((movie) => (
            <div key={movie.id}>
              <MovieListItem
                movie={movie}
                refresh={handleRefresh}
                title={movie.title}
                image={movie.poster}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default checkAdmin(ListMovies);
