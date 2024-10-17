import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorPage from "./error-page";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DiscoverPage from "./pages/DiscoverPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import AccountPage from "./pages/AccountPage";
import UserShortcutsPage from "./pages/UserShortcutsPage";
import IdeasPage from "./pages/IdeasPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import GoogleCallback from "./components/GoogleCallback";
import UploadPage from "./pages/UploadPage";
import history from "./history";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/discover",
        element: <DiscoverPage />,
      },
      {
        path: "/user/shortcuts",
        element: <UserShortcutsPage />,
      },
      {
        path: "/user/applications",
        element: <ApplicationsPage />,
      },
      {
        path: "/user/ideas",
        element: <IdeasPage />,
      },
      {
        path: "/user/account",
        element: <AccountPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/social/google/callback",
        element: <GoogleCallback />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/bulk/upload",
        element: <UploadPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} history={history} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
