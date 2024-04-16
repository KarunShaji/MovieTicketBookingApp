import Navbar from "./components/Navbar";
import { Link } from "react-router-dom";

function App() {
  return (
    <div>
      <Navbar />

      <div className="text-center" style={{ marginTop: "150px"}}>
        <h3>CineMate Your Ticketing Partner</h3>
        <h6>The Ultimate Ticket Solution</h6>
      </div>
      <br />
      <br />
      <div className="text-center">
        <Link to={"/register"} className="btn btn-dark">
          SignUp
        </Link>
        <p style={{ marginTop: "200px" }}>Already have an account?</p>
        <Link to={"/login"}>Login</Link>
      </div>
    </div>
  );
}

export default App;
