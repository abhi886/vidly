const config = require('config');
const jwt = require('jsonwebtoken');

const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const employerSchema =  new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // minlength: 5,
    // maxlength: 50
  },
  email: {
      type: String,
      // required: true,
      // minlength: 5,
      // maxlength: 255,
      // unique: true
    },
    password: {
      type: String,
      // required: true,
      // minlength: 5,
      // maxlength: 1024
    },


});

employerSchema.methods.generateAuthToken = function(){
 
  const token = jwt.sign({_id: this._id},config.get('jwtPrivateKey'));
  return token;
 

}
const Employer = mongoose.model('Employer', employerSchema);
employerSchema.methods.generateAuthToken = function(){
 
    const token = jwt.sign({_id: this._id},config.get('jwtPrivateKey'));
    return token;
   
  
  }

function validateEmployer(employer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),

  };

  return Joi.validate(employer, schema);
}

exports.Employer = Employer; 
exports.validate = validateEmployer;