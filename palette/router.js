//Here we are going to make a router for saving a palette that has a specific user attached
'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Palette} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

//Post to add new palette for a specific user
router.post('/', jsonParser, (req, res) => {
  
  let {user,name,rgb}=req.body;

  //console.log(`Backend>Palette>Router.js data:`,user,name,rgb);
  console.log(`Backend>Palette>Router.js data:`,req.body);
  return Palette.create({
    user,
    name,
    rgb
  }).then(palette => {
    return res.status(201).json(palette.serialize());
  }).catch(err => {
    // Forward validation errors on to the client, otherwise give a 500
    // error because something unexpected has happened
    if (err.reason === 'ValidationError') {
      return res.status(err.code).json(err);
    }
    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});

// A protected endpoint which needs a valid JWT to access it
router.get('/', (req, res) => {
  let {user} = req.body;
  return Palette.find({user})
  .then(data=> {res.json({data})});
});

module.exports = {router};