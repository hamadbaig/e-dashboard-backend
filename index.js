const express = require("express");
require("./db/config");
const User = require("./db/Users");
const Product = require("./db/Product");
const cors = require("cors");
const Jwt = require("jsonwebtoken");
const JwtKey = "e-commerce";
const app = express();
app.use(express.json());
app.use(cors());
// sign up api
app.post("/register", async (req, resp) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({ result }, JwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      resp.send("something went wrong try agin after a while");
    }
    resp.send({ result, auth: token });
  });
});
// login API
app.post("/login", async (req, resp) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      Jwt.sign({ user }, JwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          resp.send("something went wrong try agin after a while");
        }
        resp.send({ user, auth: token });
      });
    } else {
      resp.send("user not found");
    }
  } else {
    resp.send("user not found");
  }
});
// add product
app.post("/add-product", verifyToken, async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();

  resp.send(result);
});
// get product list
app.get("/products", verifyToken, async (req, resp) => {
  let products = await Product.find();
  if (products.length > 0) {
    resp.send(products);
  } else {
    resp.send({ result: "login: no product found" });
  }
});
// delete product
app.delete("/product/:id", verifyToken, async (req, resp) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  resp.send(result);
});
// get product to update
app.get("/update/:id", verifyToken, async (req, resp) => {
  const result = await Product.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "no record found" });
  }
});
// update product
app.put("/update/:id", verifyToken, async (req, resp) => {
  const result = await Product.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  resp.send(result);
});
function verifyToken(req, resp, next) {
  let Token = req.headers["authorization"];
  console.log("token:ab", Token);

  if (Token) {
    // Token = Token.split(" ")[1];
    Jwt.verify(Token, JwtKey, (err, valid) => {
      if (err) {
        resp.status(401).send({ result: " please enter valid token" });
      } else {
        next();
      }
    });
  } else {
    resp.status(403).send({ result: "please enter valid token with header" });
  }
}
app.listen(5000);
