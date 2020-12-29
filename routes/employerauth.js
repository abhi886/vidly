
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {Employer} = require('../models/employer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    
    let employer = await Employer.findOne({email: req.body.email});
    if (!employer) return res.status(400).send('Invalid Email or Password');

    const validPassword = await bcrypt.compare(req.body.password, employer.password);
   if (!validPassword) return res.status(400).send('Invalid email or password');

    
   const token = employer.generateAuthToken();
   
    res.send(token);
});



function validate(req){
    const schema = {
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required(),
    
      };
    
      return Joi.validate(req, schema);
}
module.exports = router;