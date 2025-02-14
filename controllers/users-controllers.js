require("dotenv").config();
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const https = require('https');
const Guest = require("../models/tourist");
const User = require("../models/user");
const nodeoutlook = require("nodejs-nodemailer-outlook");
const Tourist = require("../models/tourist");
const fs = require('fs');
const nodemailer = require('nodemailer');

////////////////////
const gettourists = async (req, res, next) => {
  let tourists;

  try {
    tourists = await Guest.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching tourists failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ tourists: tourists.map((tourist) => tourist.toObject({ getters: true })) });
};

// create tourist
const savetourist = async (req, res, next) => {

  const { touristname, touristemail, touristpassword, tour } = req.body;
  const createdTourist = new Tourist({
    touristname: touristname,
    touristemail: touristemail,
    touristpassword: touristpassword,
    tour: tour,
  });

  try {
    await createdTourist.save();
  } catch (err) {
    const error = new HttpError("Failed, please try again.", 500);
    console.log(err);
    return next(error);
  }
  res.status(201).json({ tourist: createdTourist });
}

// updateTourist
const updateTourist = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { tour } = req.body;
  const touristId = req.params.tid;

  let tourist;
  try {
    tourist = await User.findById(touristId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find tourist.",
      500
    );
    return next(error);
  }

  tourist.tour = tour;

  try {
    await tourist.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update user.",
      500
    );
    return next(error);
  }

  res.status(200).json({ tourist: tourist.toObject({ getters: true }) });
};


// user sign up
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { username, email, password } =
    req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }


  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Could not create user", 500);

    return next(error);
  }

  const createdUser = new User({
    username, // name: name
    email,
    password: hashedPassword,

  });


  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    console.log(err);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, username: createdUser.username },
      `${process.env.JWT_KEY}`,
      { expiresIn: "10h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, username: createdUser.username, token: token });
};

//user login
const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ username: username });

  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);

  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, username: existingUser.username },
      `${process.env.JWT_KEY}`,
      { expiresIn: "1h" }
    );

  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({
    user: existingUser,
    username: existingUser.username,
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });

};

//contact message//
const send_mail = async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  var transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
      user: 'onalnihat1986@gmail.com',
      pass: 'gsfn oxub flrb alhb'
    },
    secure: true,
  });

  const mailData = {
    from: 'onalnihat1986@gmail.com',
    to: "onalnihat@outlook.com",
    subject: `${name} isimli kisiden basvuru`,
    text: ``,
    html: `<b>email: </b>${email}<br><br/><b>phone: </b>${phone}<br><br/><b>subject: </b>${message}`,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).send({ message: "Mail send", message_id: info.messageId });
  });

};

const uploadImage = async (req, res, next) => {

  try {
    const data = req.file;
    res.json({ message: "data recieved", data: data });
  } catch {
    res.status(500).send("error");
  }
};

const deleteImage = async (req, res, next) => {
  const { image } = req.body;
  fs.unlink(image, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted image." });
};






exports.login = login;
exports.send_mail = send_mail;
exports.signup = signup;
exports.uploadImage = uploadImage;
exports.deleteImage = deleteImage;

