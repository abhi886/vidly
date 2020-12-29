const bcrypt = require('bcrypt');
const _ = require('lodash');

//1. we export User and validate function from the mdoels/user folder
const {User, validate} = require('../models/tenant');

//2. We also need mongoose, express and router
const mongoose = require('mongoose');
const express = require('express');
const { Tenant } = require('../models/tenant');
const router = express.Router();

//3. These are all the routes.
router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let tenant = await Tenant.findOne({ email: req.body.email });
    if (tenant) return res.status(400).send('User already registered');

    tenant = new Tenant(_.pick(req.body, ['name','email', 'password']));
    // console.log(tenant);
    const salt = await bcrypt.genSalt(10);
    tenant.password = await bcrypt.hash(tenant.password, salt);
    await tenant.save();

    

// Send the response back to the user
    res.send(_.pick(tenant, ['_id', 'name', 'email']));
  });


// 4. Finally we need to export this router

module.exports = router;