import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Register from "./components/Authentication/register";
import Login from "./components/Authentication/login";
import AddMovie from "./components/Admin/AddMovie";
import ListMovies from "./components/Admin/Dashboard";
import ViewMovie from "./components/User/ViewMovie";
import EditMovie from "./components/Admin/EditMovie";
import ListMoviesUser from "./components/User/Dashboard";
import YourBookings from "./components/Booking/YourBookings";



const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/admin/dashboard", element: <ListMovies /> },
    { path: "/dashboard", element: <ListMoviesUser /> },
    { path: "/admin/create", element: <AddMovie /> },
    { path: "/view/:postId", element: <ViewMovie /> },
    { path: "/admin/edit/:postId", element: <EditMovie /> },
    { path: "/bookings", element: <YourBookings /> },
]);

export default router;
