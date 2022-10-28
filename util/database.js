const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://vlaluk352:vovakill441@study1.bz9oka3.mongodb.net/?retryWrites=true&w=majority";

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
