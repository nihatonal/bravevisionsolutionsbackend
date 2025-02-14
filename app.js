const fs = require("fs");
const path = require("path");

const express = require("express");
const http = require('http')
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io")
const userRoutes = require("./routes/users-routes");
const touristsRoutes = require("./routes/tourists-routes");

const HttpError = require("./models/http-error");


const app = express();

app.use(bodyParser.json());

// const corsOptions = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "DELETE, GET, OPTIONS, PATCH, POST, PUT",
//   "Access-Control-Allow-Headers":
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization",
//   origin: "*",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };
app.use(cors());
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});
console.log(process.env.PORT)


app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api", userRoutes);
app.use("/api/tourists", touristsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wu6wj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    , { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => server)
  .catch((err) => {
    console.log(err);
  })


