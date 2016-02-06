'use strict';

var Promise = require('bluebird');
var discover = require('node-discover')();
var _ = require('lodash');

var found_services = {};

discover.on('added', function(obj) {
  // sometimes random objects come through;
  // I don't know why
  if ( obj && obj.advertisement ) {
    found_services[obj.advertisement.name] = obj.advertisement;

    service.callbacks.map(function(callback, i) {
      callback(obj.advertisement);
      delete service.callbacks[i];
    });
  }
});

var service = {
  services: {},
  callbacks: [],
  advertise: function() {
    discover.advertise(_.extend({ name: this.name }, this.options));
  },
  register: function(name, options) {
    if ( ! name ) {
      throw "Provide arguments for register";
    }
    this.name = name;
    this.options = _.extend({ available: false, services: [] }, options || {});

    this.options.services.map(function(service) {
      if ( service.name ) {
        this.services[service] = _.extend({available: false}, service);
      } else {
        this.services[service] = {
          name: service,
          available: false
        };
      }
    }.bind(this));

    discover.advertise();
  },

  ready: function(callback) {
    return new Promise(function(resolve, reject) {
      if ( this.services ) {
        // Iterate through the services we expect to be available
        var services_left = Object.keys(this.services).filter(function(key) {
          return !this.services[key].available;
        }.bind(this));
        if ( services_left.length > 0 ) {
          // need to wait for services to get registered
          this.callbacks.push(services_left.map(function(service) {
            return function(service) {
              this.services[service.name] = service;
              this.ready();
            }.bind(this);
          }.bind(this)));

        } else {
          if ( callback ) {
            callback();
          }
          resolve();
        }
      } else {
        this.options.available = true;
        discover.advertise(this.options);

        if ( callback ) {
          callback();
        }
        resolve();
      }
    }.bind(this));
  }
};

module.exports = service;
