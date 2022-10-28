const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = "URI"

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

let _db;

const MongoConnect = async (cb) => {
  try {
    await client.connect();
    _db = client.db("test");
    cb();
  } catch (err) {
    console.log(err);
  } 
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  th
};

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;
