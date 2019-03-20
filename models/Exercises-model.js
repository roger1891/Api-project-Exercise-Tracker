//set up mongoose
var mongoose = require('mongoose');

//set up short id
const shortid = require('shortid');

//create schema
var Schema = mongoose.Schema;

var exercisesSchema = new Schema({
   _id: {
    'type': String,
    'default': shortid.generate
  },
  user_id: {
    'type': String,
    'default': shortid.generate,
    'required': true
  },
  description: String, 
  duration: String,
  date: {
    type: Date,
    default: Date.now
  }
});

var ExercisesModel = mongoose.model('ExercisesModel', exercisesSchema);

module.exports = ExercisesModel;