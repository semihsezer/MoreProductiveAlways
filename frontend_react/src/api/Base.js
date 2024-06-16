import axios from "axios";
import JWTAuthAPI, { jwtAuthAPI } from "../auth/JWTAuthAPI";
import SessionAuthAPI, { sessionAuthAPI } from "../auth/SessionAuthAPI";

axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";

export const api = axios.create({});
const AUTH_API_TYPE = "JWTAPI"; // "JWTAPI" or "SessionAPI"

export function getAuthAPI() {
  if (AUTH_API_TYPE === "JWTAPI") {
    return JWTAuthAPI;
  } else {
    return SessionAuthAPI;
  }
}

export function getAuthAPIInstance() {
  if (AUTH_API_TYPE === "JWTAPI") {
    return jwtAuthAPI;
  } else {
    return sessionAuthAPI;
  }
}
