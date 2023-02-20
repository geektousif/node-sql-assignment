const express = require("express");
const axios = require("axios").default;
const { connectDB } = require("./config/db");
const { sequelize, User } = require("./models/User");
const asyncHandler = require("express-async-handler");

const app = express();

connectDB();

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/home");
});

app.get(
  "/fetchUser",
  asyncHandler(async (req, res, next) => {
    const { data } = await axios.get("https://randomuser.me/api/");
    const name = `${data.results[0].name.title} ${data.results[0].name.first} ${data.results[0].name.last}`;
    const email = data.results[0].email;

    await sequelize.sync({ force: false, alter: true });
    await User.create({ name, email });

    return res.render("pages/home");
  })
);

app.get(
  "/userList",
  asyncHandler(async (req, res, next) => {
    const users = await User.findAll();
    res.render("pages/userList", { users: users });
  })
);

module.exports = app;
