const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');

const mongoose = require('mongoose');
var ExercisesModel = require(__dirname + "/models/Exercises-model");
var UserModel = require(__dirname + "/models/User-model");
mongoose.connect(process.env.MLAB_URI);

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Not found middleware
//app.use((req, res, next) => {
  //return next({status: 404, message: 'not found'})
//});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
});

/**my code**/
//new user
app.post("/api/exercise/new-user", (req, res) => {
  //get username from input fields
  var name = req.body.username;
  
  //create userModel data
  var userModel = new UserModel({
     user: name
  });  
  
  //save to database
  userModel.save((err, data) => {
    (err)? res.json({"error" : "problem saving to user db: " + err}): res.json(data);
  });
});

//new exercise
app.post("/api/exercise/add", (req, res) => {
     //create variables based on input fields
     var id = req.body.userId;
     var description = req.body.description;
     var duration = req.body.duration;
     var date = req.body.date;
  
    //create exercides model data
    var exercisesModel = new ExercisesModel({
      user_id : id,
      description: description, 
      duration: duration,
      date: date
    });    
  
    //create userModel data
    /*var userModel = new UserModel({
       exercises: exercisesModel
    });*/  

  //user id object
  var jsonObject = {_id : id};
  //store in database
  exercisesModel.save((err, data)=>{    
    (err)? res.json({"error" : "problem saving to exercise db: " + err}): res.json(data);
  });    
});

//show all users
app.get("/api/exercise/users", (req, res) => {
  UserModel.find({}, (err,data)=> {
    (err)? res.json({"error":err}): res.json(data);    
  });  
});


//show exercise log
// /api/exercise/log?{userId}[&from][&to][&limit]
// /api/exercise/log?userId=5rOfqfQkR&from=2019-09-19&to=2019-09-22&limit=2
app.get("/api/exercise/log", (req, res) => {
  //query string variables
  var queryString = {
    userId : req.query.userId,
    from : req.query.from,
    to : req.query.to,
    limit : parseInt(req.query.limit)
  };
  
  //empy findBy query to be searched
  var findBy = {};
  
  //if these queries are not undefined
  if(queryString.from != undefined && queryString.to != undefined && queryString.limit != NaN)
  {
    //initialized findBy query by user_id and date
    findBy = {
      user_id : queryString.userId,
      'date': {$gte: queryString.from, $lt: queryString.to}
    }
    
    //execute query to search db and display as json
    ExercisesModel.find(findBy).limit(queryString.limit).exec((err, data) => {
      (err) ? res.json({"error" : "problem searching for exercises: " + err}) :  res.json(data);      
    });
  }
  else
  {
    //initialized findBy query by user_id only
    findBy = {
      user_id : queryString.userId
    }   
     
    //execute query to search db and display as json
    ExercisesModel.find(findBy).exec((err, data) => {
      (err) ? res.json({"error" : "problem searching for exercises: " + err}) :  res.json(data);      
    });
  } 
});

/**my code**/

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});

//check whether mongo database is connected or not  
mongoose.connection.on('open', function (ref) {
  console.log('Connected to mongo server. ' +mongoose.connection.readyState);
});
mongoose.connection.on('error', function (err) {
  console.log('Could not connect to mongo server! ' + mongoose.connection.readyState);
  console.log(err); 
});