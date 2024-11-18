export default () => ({
  redirectUri: 'http://localhost:8081/en/oauth2/spotify',
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
