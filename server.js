// server.js

/*
====================================
SETUP
====================================
*/
var express = require('express'); // like Java imports
var app = express(); // create express app

var bodyParser = require('body-parser');

// configure app to use body parser to get POST data
app.use(bodyParser.urlencoded({ extended: true})); // parse query string
app.use(bodyParser.json()); // parse json

var port = process.env.PORT || 8080; // set up port #

// Database
var mongoose = require('mongoose');
var connectionString = '';
 mongoose.connect( connectionString, { useNewUrlParser: true });
var Bear = require('./models/bear');

/*
====================================
API ROUTES
====================================
*/
var router = express.Router(); // instance of express router

// Register routes. All routers will be be prefixed as follows
var prefix = '/';
app.use(prefix, router);

/*
Middleware to use for all requests -> log each time router is used and
then route to correct function.
Can allow us to do preprocessing / error checking before proceeding w/ request
Router processes routes in order so it's important this is defined first.
*/
router.use(function(req, res, next) {
  console.log('Something is happening.');
  next(); // routing will stop here if next isn't called
});

// base route
router.get('/', function(req, res) {
  res.json({ message: 'It works :)'});
});

// Routes that end in '/bears'
router.route('/bears')
// Create bear - accessed at POST /bears
.post(function(req, res) {
  var bear = new Bear(); // new instance of bear model
  bear.name = req.body.name;

  // save bear to db and check for error
  bear.save(function(err) {
    if(err)
      res.send(err); // basically a return here
    res.json({ message: 'Bear ' + bear.name + ' has been created!'});
  });
})
// Get all bears
.get(function(req, res) {
  Bear.find(function(err, bears) {
    if(err)
      res.send(err);
    res.json(bears);
  });
});

// Routes for a specific bear - ends in '/bears/bear_id'
router.route('/bears/:bear_id')
// Modify a bear
.post(function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear) {
    if(err)
      res.send(err);

    bear.name = req.body.name;
    bear.save(function(err) {
      if(err)
        res.send(err);
      res.json({ message: 'Bear has been updated!' });
    });
  });
})
// Fetch a bear
.get(function(req, res) {
  Bear.findById(req.params.bear_id, function(err, bear) {
    if(err)
      res.send(err);
    res.json(bear);
  });
})
// Delete a bear
.delete(function(req,res) {
  Bear.remove({
    _id: req.params.bear_id
  }, function(err, bear) {
    if(err)
      res.send(err);
    res.json({ message : 'Successfully deleted bear with id '  +  req.params.bear_id});
  });
});


/*
====================================
START SERVER
====================================
*/
app.listen(port);
console.log('Server running on port' + port);
