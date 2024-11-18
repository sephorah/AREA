export default () => ({
  redirectUri: 'http://localhost:8081/en/oauth2/github',
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  webhookUrl: 'https://communal-engaged-mudfish.ngrok-free.app',
});
