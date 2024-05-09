const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://hammad:hammad%40123@e-commerce.y3w9cfo.mongodb.net/webstore"
  )
  .then(() => console.log("mongo dp connected"))
  .catch((err) => console.log(err));
