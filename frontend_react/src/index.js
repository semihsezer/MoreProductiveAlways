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
import HelloWorld from './HelloWorld';
import HelloWorld2 from './HelloWorld2';
import Applications from './Applications';
import Account from './Account';
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
        element: <HelloWorld />,
      },
      {
        path: "/user/shortcuts",
        element: <HelloWorld2 />,
      },
      {
        path: "/user/applications",
        element: <Applications />,
      },
      {
        path: "/user/account",
        element: <Account />,
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
