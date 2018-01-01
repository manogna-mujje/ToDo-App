const express = require('express');
var bodyParser = require('body-parser')
var mongo = require('./mongo');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/ping', (req, res) => {
  res.status(200).send('Success! Website is alive.');
})

/**
 * Create a new Task using POST;
 * If the same already exists, just update the document
 */

app.post('/newTask', (req, res) => {
  try {
    mongo.connect(function(db){
      var coll = mongo.collection('todos');
      coll.update(
        {
          Task: req.body.Task,
          Priority: req.body.Priority,
          Status: req.body.Status
        },
        {
          $setOnInsert: { DateAdded: new Date() }
        },
        { upsert: true },
        function(err, result){
          if(err) throw err;
          console.log('Document Updated Successfully');
          res.send('Document added Successfully');
        }
      )
   })
  } catch (e) {
    throw new Error(e);
  }
})

app.put('/updateTask', (req, res) => {
  try {
    mongo.connect(function(db){
      console.log("PUTConnected to MongoDB");
      var coll = mongo.collection('todos');
      coll.updateOne(
        { Task: req.body.Task },
        {
          $set: {Priority: req.body.Priority, Status: req.body.Status},
          $currentDate: { LastModified: true }
        }
      )
      res.status(200).send('Document modified successfully.');
    })
  } catch (e) {
    throw new Error(e);
  }
})

/**
 * Fetching all the tasks using GET
 */

app.get('/tasks', (req, res) => {
try {
  mongo.connect(function(db){
    var coll = mongo.collection('todos');
    coll.find().toArray(function (err, docs){
      if(err){
        console.log(err);
      }
    res.status(200).send(docs);
    });
 })
} catch (e) {
  throw new Error(e);
}
})

app.listen(3000, () => {
  console.log('Server is up and running at port 3000');
})
