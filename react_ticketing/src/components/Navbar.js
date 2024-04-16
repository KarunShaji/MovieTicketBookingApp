import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";

function Navbar() {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function logout() {
    if (user) {
      try {
        axios.post(
          "http://127.0.0.1:8000/api/logout/",
          {},
          {
            headers: {
              Authorization: `Token ${user.token}`,
            },
          }
        );
        dispatch(removeUser());
        navigate("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  }

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <div className="navbar-brand">
        <NavLink
          to={"/"}
          className="nav-link"
          style={{ color: "#ffffff", marginLeft: "20px" }}
        >
          <b>Cinemate</b>
        </NavLink>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse mr-auto"
        id="navbarNav"
        style={{ float: "left" }}
      >
        <ul
          className="navbar-nav ms-auto"
          style={{ color: "#ffffff", marginRight: "20px" }}
        >
          {user ? (
            <>
              <li className="nav-item">
                <NavLink to={"/bookings"} className="nav-link">
                  Your Bookings
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to={
                    user.username === "karun@admin.com"
                      ? "/admin/dashboard"
                      : "/dashboard"
                  }
                  className="nav-link"
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" onClick={logout}>
                  Logout
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to={"/register"} className="nav-link">
                  Signup
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={"/login"} className="nav-link">
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
