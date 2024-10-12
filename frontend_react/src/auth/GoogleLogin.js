const REACT_APP_FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000";

export const onGoogleLogin = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const next = urlParams.get("next");
  const redirect_url = encodeURI(`${REACT_APP_FRONTEND_URL}/social/google/callback`);
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirect_url}&prompt=select_account&response_type=code&client_id=676704901081-i17eo6no2dqsj3eulf2dr7v191ftmu9p.apps.googleusercontent.com&scope=openid%20email%20profile&state=${next}`;
};
