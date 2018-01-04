const MongoClient = require('mongodb').MongoClient;
var connected = false;
var db;
var mongoURL = 'mongodb://localhost:27017/TodoApp';

var connect = (callback) => {
  MongoClient.connect(mongoURL, function (err, _db) {
  if(err) {
    console.log("Unable to connect to MongoDB server");
  } else {
    connected = true;
    db = _db;
    callback && callback(db);
  }
  db.close();
  });
}

var collection = function (name){
  if(!connected) {
    console.log('Must connect to database first');
  }
  return db.collection(name);
}

module.exports = {
  connect,
  collection
}
