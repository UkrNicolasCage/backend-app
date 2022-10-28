const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = mongoDb.ObjectId(id);
  }

  save = async () => {
    const db = getDb();

    await db.collection("users").insertOne(this);
  };

  addToCart = async (product) => {
    const db = getDb();
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    console.log(this.cart.items);

    const cartProductIndex = this.cart.items.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    );

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongoDb.ObjectId(product._id),
        quantity: 1,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    await db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  };

  getCart = async () => {
    const db = getDb();
    const productIds = this.cart.items.map((item) => item.productId);
    const products = await db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map((p) => {
      return {
        ...p,
        quantity: this.cart.items.find(
          (i) => i.productId.toString() == p._id.toString()
        ).quantity,
      };
    });
  };

  deleteItemFromCart = async (productId) => {
    const updatedCartItems = [...this.cart.items].filter((item) => {
      return item.productId.toString() !== productId.toString();
    });

    const db = getDb();

    await db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
  };

  addOrder = async () => {
    const db = getDb();
    const products = await this.getCart();

    const order = {
      items: products,
      user: {
        _id: new mongoDb.ObjectId(this._id),
        name: this.name,
        email: this.email,
      },
    };
    await db.collection("orders").insertOne(order);
    this.cart = { items: [] };
    await db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: { items: [] } } }
      );
  };

  getOrders = async () => {
    const db = getDb();
    return await db
      .collection("orders")
      .find({ "user._id": new mongoDb.ObjectId(this._id) })
      .toArray();
  };

  static findById = async (id) => {
    const db = getDb();
    try {
      return await db
        .collection("users")
        .find({ _id: mongoDb.ObjectId(id) })
        .next();
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = User;
