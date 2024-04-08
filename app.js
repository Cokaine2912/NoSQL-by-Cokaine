const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
// const mongoConnect = require("./util/mongodatabase").mongoConnect;
const User = require("./models/user");
const Order = require("./models/order")

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("661373f6092159085406a48c")
    .then((user) => {
      console.log(user);
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://cokaine2912:ygLWyweXZt3qvQmv@cluster0.gw8k9ot.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    console.log("START");

    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Jos",
          email: "jos@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

// mongoConnect(() => {
//   app.listen(3000);
// });
