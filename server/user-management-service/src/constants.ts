export default () => ({
  secret: process.env.SECRET_JWT,
  saltRounds: parseInt(process.env.SALT_ROUNDS),
});
