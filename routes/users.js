const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config'); 

const bcrypt = require('bcrypt');
const _ = require('lodash');
//1. we export User and validate function from the mdoels/user folder
const {User, validate} = require('../models/user');

//2. We also need mongoose, express and router
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();



//3. These are all the routes.
router.get('/me', auth, async(req, res) => {
const user = await (await User.findById(req.user._id)).select('-password');
res.send(user);
});



router.post('/', async (req, res) => {



    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name','email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    

// Send the response back to the user
const token = user.generateAuthToken();

    res.header('x-auth-token',token).send(_.pick(user, ['_id', 'name', 'email']));
  });


// 4. Finally we need to export this router

module.exports = router;