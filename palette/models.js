'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const PaletteSchema = mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  rgb: {
    type: [[Number]],
    required: true,
  }
});

PaletteSchema.methods.serialize = function() {
  return {
    name: this.name || ''
  };
};


const Palette = mongoose.model('Palette', PaletteSchema);

module.exports = {Palette};
