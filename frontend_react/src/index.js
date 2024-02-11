import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorPage from "./error-page";
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import DiscoverPage from './components/pages/DiscoverPage';
import ApplicationsPage from './components/pages/ApplicationsPage';
import AccountPage from './components/pages/AccountPage';
import UserShortcutsPage from './components/pages/UserShortcutsPage';
import IdeasPage from './components/pages/IdeasPage';
import { Outlet } from "react-router-dom";
import history from './history'
import { useState } from 'react';

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
      }
    ]
  },
]);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} history={history} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
