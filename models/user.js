const mongoose = require("mongoose");
const product = require("./product");
const Order = require("./order");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteCartItem = function (productId) {
  const updatedCartItems = this.cart.items.filter((cp) => {
    return cp.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.addOrder = async function () {
  console.log("Inside Add Order !!!");
  const products = this.cart.items;
  
  const temp = products.map((p) => {
    return { product: p.productId, quantity: p.quantity };
  });
  const order = {
    products: temp,
    user: { name: this.name, userId: this._id },
  };
  console.log("order update", order);
  const newOrder = new Order(order);
  return newOrder.save();
};

userSchema.methods.getOrders = function () {
  const order = Order.find({ "user.userId": this._id });
  console.log(order);
};

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");
// const getDB = require("../util/mongodatabase").getDB;

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDB();
//     return db.collection("users").insertOne(this);
//   }

//   getCart() {
//     const db = getDB();
//     const productIds = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   deleteCartItem(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     const db = getDB();
//     if (cartProductIndex >= 0) {
//       const updatedcart = this.cart;
//       console.log("Pre DElete cart !", this.cart);
//       updatedcart.items.splice(cartProductIndex, 1);
//       console.log("UPDATED ONE !!", updatedcart);
//       return db
//         .collection("users")
//         .updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: updatedcart } }
//         );
//     }
//   }

//   addOrder() {
//     const db = getDB();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDB();
//     return db
//       .collection("orders")
//       .find({ "user._id" : new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDB();
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
