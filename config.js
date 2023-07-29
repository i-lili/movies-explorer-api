module.exports = {
  DB_URL: process.env.DB_URL || 'mongodb://127.0.0.1:27017/bitfilmsdb',
  JWT_SECRET: process.env.JWT_SECRET || 'development-secret',
  PORT: process.env.PORT || 3000,
};
