//set up mongoose
var mongoose = require('mongoose');
//set up short id
const shortid = require('shortid');
//link exercise model
//var ExercisesModel = require(__dirname + "/Exercises-model");
//got exercise schema using the same name in exercises-model file name
//var ExercisesSchema = mongoose.model("ExercisesModel").schema;
//create schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
  _id: {
    'type': String,
    'default': shortid.generate
  },
  user: String,
  //exercises: [ExercisesSchema]
});

var UserModel = mongoose.model('UserModel', userSchema);

module.exports = UserModel;