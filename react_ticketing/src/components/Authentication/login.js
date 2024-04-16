import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function attemptLogin() {
    axios
      .post("http://127.0.0.1:8000/api/login/", {
        username: username,
        password: password,
      })
      .then((response) => {
        setErrorMessage("");
        const user = {
          username: username,
          userId: response.data.id,
          token: response.data.token,
          userType: response.data.user_type,
        };

        dispatch(setUser(user));

        if (
          user.username === "karun@admin.com" ||
          user.userType === "admin" ||
          user.userType === "superuser"
        ) {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        if (error.response.data.errors) {
          setErrorMessage(Object.values(error.response.data.errors).join(""));
        } else if (error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Invalid login user. Please contact admin");
        }
      });
  }

  return (
    <div>
      <Navbar />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-8 offset-2">
            <h1 className="text-center">
              <b>Login</b>
            </h1>
            <br />
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            <div className="form-group">
              <label>Username : </label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group">
              <label>Password : </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <br />
            <div className="form-group text-center">
              <button className="btn btn-primary" onClick={attemptLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
