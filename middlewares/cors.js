const cors = require('cors');

const allowedOrigins = [
  'https://moviesdiploma.nomoreparties.sbs',
  'http://moviesdiploma.nomoreparties.sbs',
];

const corsOptions = {
  origin(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
