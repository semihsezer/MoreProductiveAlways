export const onGoogleLogin = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const next = urlParams.get("next");
  // TODO: Fix URL
  const redirect_url = encodeURI("http://localhost:3000/social/google/callback");
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirect_url}&prompt=select_account&response_type=code&client_id=676704901081-i17eo6no2dqsj3eulf2dr7v191ftmu9p.apps.googleusercontent.com&scope=openid%20email%20profile&state=${next}`;
};
