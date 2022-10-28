const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;
class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongoDb.ObjectId(id) : null;
    this.userId = userId;
  }

  save = async () => {
    const db = getDb();
    if (this._id) {
      await db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      await db.collection("products").insertOne(this);
    }
  };

  static fetchAll = async () => {
    const db = getDb();
    try {
      return await db.collection("products").find().toArray();
    } catch (err) {
      console.log(err);
    }
  };

  static findById = async (id) => {
    const db = getDb();
    try {
      return await db
        .collection("products")
        .find({ _id: mongoDb.ObjectId(id) })
        .next();
    } catch (err) {
      console.log(err);
    }
  };

  static deleteById = async (id) => {
    const db = getDb();
    try {
      await db
        .collection("products")
        .deleteOne({ _id: new mongoDb.ObjectId(id) });
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = Product;
