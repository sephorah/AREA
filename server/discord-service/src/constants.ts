export default () => ({
  redirectUri: 'http://localhost:8081/fr/oauth2/discord',
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
});
