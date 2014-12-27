"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;var _ = require("lodash-next");
var MESSAGE_TYPES = require("./MESSAGE_TYPES");
var REV_MESSAGE_TYPES = _.invert(MESSAGE_TYPES);

var Message = function Message(type, payload) {
  _.dev(function () {
    return (REV_MESSAGE_TYPES[type] !== void 0).should.be.ok && (payload === null || _.isObject(payload)).should.be.ok;
  });
  _.extend(this, {
    _type: type,
    _payload: payload,
    _json: null });
};

Message.prototype.serialize = function () {
  // lazy-memoized JSON-stringification
  if (this._json === null) {
    this._json = JSON.stringify({
      t: this._type,
      p: this._payload });
  }
  return this._json;
};

Message.unserialize = function (str) {
  _.dev(function () {
    return str.should.be.a.String;
  });
  var _ref = JSON.parse(str);

  var t = _ref.t;
  var p = _ref.p;
  return new Message(t, p);
};

_.extend(Message.prototype, {
  _type: null,
  _payload: null,
  _json: null });

module.exports = Message;