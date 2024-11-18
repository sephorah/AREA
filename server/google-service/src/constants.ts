export default () => ({
  redirectUri: 'http://localhost:8081/en/oauth2/google',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
});
