const express = require("express");
require("./db/config");
const User = require("./db/Users");
const Product = require("./db/Product");
const cors = require("cors");
// const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());
// sign up api
app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  resp.send(result);
});
// login API
app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      resp.send(user);
    } else {
      resp.send("user not found");
    }
  } else {
    resp.send("user not found");
  }
});
// add product
app.post("/add-product", async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();

  resp.send(result);
});
app.listen(5000);
