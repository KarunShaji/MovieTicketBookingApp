import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import store from "./store/store";
import AutoLogin from "./components/Authentication/AutoLogin";

import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import router from "./router";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AutoLogin>
        <RouterProvider router={router} />
      </AutoLogin>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
