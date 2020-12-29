
const jwt = require('jsonwebtoken');
const config = require('config'); 


const bcrypt = require('bcrypt');
const _ = require('lodash');

//1. we export User and validate function from the mdoels/user folder
const {Employer, validate} = require('../models/employer');

//2. We also need mongoose, express and router
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//3. These are all the routes.
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let employer = await Employer.findOne({ email: req.body.email });
    if (employer) return res.status(400).send('User already registered');

    employer = new Employer(_.pick(req.body, ['name','email', 'password']));
//     // console.log(tenant);
    const salt = await bcrypt.genSalt(10);
    employer.password = await bcrypt.hash(employer.password, salt);
    await employer.save();

    
// Send the response back to the user
const token = employer.generateAuthToken();

    res.header('x-auth-token',token).send(_.pick(employer, ['_id', 'name', 'email']));
// // Send the response back to the user
  
  });


// 4. Finally we need to export this router

module.exports = router;