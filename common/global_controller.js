(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['lodash'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('lodash'));
    } else {
        // Browser globals (root is window)
        root.GlobalController = factory(root._);
    }
}(this, function (_) {

  var GlobalController = function(options) {
    this.listeners = [];

    this.initialize.apply(this, options);
  };

  _.extend(GlobalController.prototype, {
    events: {},

    attributes: {},

    initialize: function(){},

    register: function(listener, options) {
      if ((typeof(listener) !== 'object') ||
         (typeof(listener.trigger) !== 'function')) {
        throw "Only objects with a 'trigger' function can be registered";
      }

      var opts = (typeof(options) === 'object') ? options : {};

      this.listeners.push({ obj: listener, opts: opts});
      this.trigger('register', listener);
    },

    unregister: function(listener) {
      this.listeners = _.reject(this.listeners, function(l) {
        return (l.obj === listener);
      });
    },

    get: function(attr, def) {
      var a = this.attributes[attr];
      return (typeof(a) === 'undefined') ? def : a;
    },

    set: function(attr, val) {
      var oldVal = this.attributes[attr];
      this.attributes[attr] = val;

      this.trigger('change:'+attr, val, oldVal);
    },

    trigger: function(event) {
      var args = Array.prototype.slice.call(arguments, 1);
      var allArgs = Array.prototype.slice.call(arguments);

      _.each(this.listeners, function(listener) {
        listener.obj.trigger.apply(listener.obj, allArgs);
      });

      var handler = null;

      if (typeof(this.events[event]) === 'string')
        handler = this[this.events[event]];
      else if (typeof(this.events[event]) === 'function')
        handler = this.events[event];

      if (typeof(handler) === 'function')
        handler.apply(this, args);
    }
  });

  GlobalController.extend = function(protoProps, classProps) {
    var ctor = function(){};

    var inherits = function(parent, protoProps, staticProps) {
      var child;

      // The constructor function for the new subclass is either defined by you
      // (the "constructor" property in your `extend` definition), or defaulted
      // by us to simply call the parent's constructor.
      if (protoProps && protoProps.hasOwnProperty('constructor')) {
        child = protoProps.constructor;
      } else {
        child = function(){ parent.apply(this, arguments); };
      }

      // Inherit class (static) properties from parent.
      _.extend(child, parent);

      // Set the prototype chain to inherit from `parent`, without calling
      // `parent`'s constructor function.
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();

      // Add prototype properties (instance properties) to the subclass,
      // if supplied.
      if (protoProps) _.extend(child.prototype, protoProps);

      // Add static properties to the constructor function, if supplied.
      if (staticProps) _.extend(child, staticProps);

      // Correctly set child's `prototype.constructor`.
      child.prototype.constructor = child;

      // Set a convenience property in case the parent's prototype is needed later.
      child.__super__ = parent.prototype;

      return child;
    };

    var child = inherits(this, protoProps, classProps);


    child.extend = this.extend;
    return child;
  };

  return GlobalController;
}));
