const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    //console.log(req.headers)
    const token = req.headers.authorization.split('Bearer ')[1]; // Authorization: 'Bearer TOKEN'
   
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, `${process.env.JWT_KEY}`);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    console.log(err);
    const error = new HttpError('Authentication failed!', 403);
    return next(error);
  }
};
