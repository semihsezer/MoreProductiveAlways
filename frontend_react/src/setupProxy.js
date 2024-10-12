const { createProxyMiddleware } = require("http-proxy-middleware");
const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: `${REACT_APP_BACKEND_URL}/api`,
      changeOrigin: false,
    })
  );
};
