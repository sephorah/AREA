export default () => ({
  redirectUri: 'http://localhost:8081/fr/oauth2/notion',
  notionClientId: process.env.NOTION_CLIENT_ID,
  notionClientSecret: process.env.NOTION_CLIENT_SECRET,
  notionVersion: process.env.NOTION_VERSION,
});
