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

/*   Palette.find({user,name}).then(palette=> { if(palette){
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: `Name Already Taken`,
      location: alreadyTaken
    });
  }
}) */


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
  let user = req.query.q;
  return Palette.find({user})
  .then(data=> {console.log(`Backend>Palette>Router.js Get data:`,data); res.send({data})})
  .catch(err => {
    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});

router.put('/', jsonParser, (req, res) => {
  
  let {paletteId,paletteRgb}=req.body;

  //console.log(`Backend>Palette>Router.js data:`,user,name,rgb);
  //console.log(`Backend>Palette>Router.js data:`,req.body);
  return Palette.updateOne({_id:paletteId},{rgb:paletteRgb}).then(palette => {
  const response = {
      message: "Palette successfully updated to:",
      rgb: palette.rgb
  };
    res.status(201).json({message:response});
  }).catch(err => {
    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});

router.delete('/', jsonParser, (req, res) => {
  
  let {paletteId}=req.body;

  //console.log(`Backend>Palette>Router.js data:`,user,name,rgb);
  console.log(`Backend>Palette>Router.js data:`,req.body);
  return Palette.deleteOne({_id:paletteId}).then(palette => {
  const response = {
      message: "Palette successfully deleted:",
      rgb: palette.rgb
  };
    res.status(201).json({message:response});
  }).catch(err => {
    res.status(500).json({code: 500, message: 'Internal server error'});
  });
});

// A protected endpoint which needs a valid JWT to access it
router.get('/community', (req, res) => {
  //handle case if less than 3 saved community palettes
  return Palette.find({})
  .then(data => {
    console.log(`Backend>Palette>Router.js Get data:`,data);
    let l=data.length;
    let newData=[data[l-1],data[l-2],data[l-3]];
    res.send({data:newData});
  });
});


module.exports = {router};