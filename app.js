const express = require('express');
var bodyParser = require('body-parser')
var mongo = require('./mongo');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var $ = require('jquery');
var functions = require('./public/functions/functions.js')
var app = express();

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.render('home', {
    welcomeMessage: 'Hey there, Manogna!'
  })
})

app.get('/ping', (req, res) => {
  res.status(200).send('Success! Website is alive.');
})

/**
 * Create a new Task using POST;
 * If the same already exists, just update the document
 */

app.post('/newTask', (req, res) => {
  try {
    console.log("Connected to MongoDB for POST request.");
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

/**
 * Updating task using PUT operation
 */
app.put('/updateTask', (req, res) => {
  try {
    mongo.connect(function(db){
      console.log("Connected to MongoDB for PUT request.");
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
 * Fetching all the tasks using GET operation
 */

app.get('/tasks', (req, res) => {
try {
  mongo.connect(function(db){
    console.log("Connected to MongoDB for GET request.");
    var coll = mongo.collection('todos');
    coll.find({}, {_id: 0}).toArray(function (err, docs){
      if(err){
        console.log(err);
      }
      var tasks = functions.loop(docs, functions.loop);
      res.render('index', {
        tasks: tasks,
        length: tasks.length
      });
      res.status(200);
    });
 })
} catch (e) {
  throw new Error(e);
}
})

/**
 * Deleting the task using DELETE operation
 */

app.delete('/removeTask', (req, res) => {
  try {
    mongo.connect(function(db){
    console.log("Connected to MongoDB for DELETE request.");
    var coll = mongo.collection('todos');
    coll.remove({'Task': req.body.Task}, function(err, doc){
      if(err){
        console.log(err);
      }
      res.status(200).send(`Selected task deleted.`);
    });
    });
  } catch (e) {
    throw new Error(e);
  }
})

http.createServer(app).listen(app.get('port'), function() {
  console.log('Server is up and running at port ' + app.get('port'));
});
