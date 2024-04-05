const mongodb = require("mongodb");
const getDB = require("../util/mongodatabase").getDB;

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  save() {
    const db = getDB();
    return db
      .collection("users")
      .insertOne(this)
      .then((user) => {
        console.log(user);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static findUserbyID(prodId) {
    const db = getDB();
    return db
      .collection("users")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((user) => {
        console.log(user);
        return user
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = User;
