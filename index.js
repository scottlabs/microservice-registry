'use strict';

var d = require('node-discover')();
var _ = require('lodash');

var service = {
  register: function(options) {
    if ( ! options ) {
      throw "Provide arguments for register";
    }
    this.options = _.extend({ available: false }, options);

    d.advertise(this.options);
  },

  ready: function() {
    this.options.available = true;
    d.advertise(this.options);
  }
};

module.exports = service;
