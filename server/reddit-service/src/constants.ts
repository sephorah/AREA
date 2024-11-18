export default () => ({
  redirectUri: 'http://localhost:8081/en/oauth2/reddit',
  redditClientId: process.env.REDDIT_CLIENT_ID,
  redditClientSecret: process.env.REDDIT_CLIENT_SECRET,
});
