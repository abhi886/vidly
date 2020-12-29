const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
//1. we export User and validate function from the mdoels/user folder
const {Tenant} = require('../models/tenant');

//2. We also need mongoose, express and router
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



//3. These are all the routes.
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let tenant = await Tenant.findOne({ email: req.body.email });
    if (!tenant) return res.status(400).send('Invalid email or password');

   const validPassword = await bcrypt.compare(req.body.password, tenant.password)
   if (!validPassword) return res.status(400).send('Invalid email or password');


    res.send(true);

 
});

  function validate(req) {
    const schema = {
      email: Joi.string().min(5).max(50).required().email(),
      password: Joi.string().min(5).max(255).required(),
  
    };
  
    return Joi.validate(req, schema);
  }
  
// 4. Finally we need to export this router

module.exports = router;