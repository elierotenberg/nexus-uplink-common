"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;var _ = require("lodash-next");
var PROTOCOL_VERSION = require("./PROTOCOL_VERSION");
var MESSAGE_TYPES = require("./MESSAGE_TYPES");
var REV_MESSAGE_TYPES = _.invert(MESSAGE_TYPES);

var Message = function Message(type, payload) {
  _.dev(function () {
    return (REV_MESSAGE_TYPES[type] !== void 0).should.be.ok && (payload === null || _.isObject(payload)).should.be.ok;
  });
  _.extend(this, {
    _type: type,
    _payload: payload,
    _json: null,
    _interpretation: null });
};

Message.prototype.toJSON = function () {
  // lazy-memoized JSON-stringification
  if (this._json === null) {
    this._json = JSON.stringify({
      t: this._type,
      p: this._payload });
  }
  return this._json;
};

Message.prototype.interpret = function () {
  if (this._interpretation === null) {
    var _ref = this;
    var _type = _ref._type;
    var _payload = _ref._payload;
    var action = undefined, clientSecret = undefined, err = undefined, params = undefined, patch = undefined, path = undefined, pid = undefined, protocol = undefined;
    if (_type === MESSAGE_TYPES.HANDSHAKE) {
      _payload.should.be.an.Object;
      clientSecret = _payload.s;
      protocol = _payload.v;
      clientSecret.should.be.a.String;
      protocol.should.be.exactly(PROTOCOL_VERSION);
      this._interpretation = { clientSecret: clientSecret };
    } else if (_type === MESSAGE_TYPES.SUBSCRIBE) {
      _payload.should.be.an.Object;
      path = _payload.p;
      path.should.be.a.String;
      this._interpretation = { path: path };
    } else if (_type === MESSAGE_TYPES.UNSUBSCRIBE) {
      _payload.should.be.an.Object;
      path = _payload.p;
      path.should.be.a.String;
      this._interpretation = { path: path };
    } else if (_type === MESSAGE_TYPES.DISPATCH) {
      _payload.should.be.an.Object;
      action = _payload.a;
      params = _payload.p;
      action.should.be.a.String;
      (params === null || _.isObject(params)).should.be.ok("params should be 'null' or an Object.");
      this._interpretation = { action: action, params: params };
    } else if (_type === MESSAGE_TYPES.HANDSHAKE_ACK) {
      _payload.should.be.an.Object;
      pid = _payload.p;
      protocol = _payload.v;
      pid.should.be.a.String;
      protocol.should.be.exactly(PROTOCOL_VERSION);
      this._interpretation = { pid: pid };
    } else if (_type === MESSAGE_TYPES.UPDATE) {
      _payload.should.be.an.Object;
      path = _payload.p;
      patch = _payload.u;
      path.should.be.a.String;
      patch.should.be.a.String;
      this._interpretation = { path: path, patch: patch };
    } else if (_type === MESSAGE_TYPES.DELETE) {
      _payload.should.be.an.Object;
      path = _payload.p;
      path.should.be.a.String;
      this._interpretation = { path: path };
    } else if (_type === MESSAGE_TYPES.ERROR) {
      _payload.should.be.an.Object;
      err = _payload.err, this._interpretation = { err: err };
    } else {
      throw new Error("Unknown message type: " + _type);
    }
  }
  return this._interpretation;
};

Message.fromJSON = function (json) {
  _.dev(function () {
    return json.should.be.a.String;
  });
  var _ref2 = JSON.parse(json);

  var t = _ref2.t;
  var p = _ref2.p;
  return new Message(t, p);
};

// Client -> Server factories

Message.Handshake = function (_ref3) {
  var clientSecret = _ref3.clientSecret;
  return new Message(MESSAGE_TYPES.HANDSHAKE, { s: clientSecret, v: PROTOCOL_VERSION });
};

Message.Subscribe = function (_ref4) {
  var path = _ref4.path;
  return new Message(MESSAGE_TYPES.SUBSCRIBE, { p: path });
};

Message.Unsubscribe = function (_ref5) {
  var path = _ref5.path;
  return new Message(MESSAGE_TYPES.UNSUBSCRIBE, { p: path });
};

Message.Dispatch = function (_ref6) {
  var action = _ref6.action;
  var params = _ref6.params;
  return new Message(MESSAGE_TYPES.DISPATCH, { a: action, p: params });
};

// Server -> Client factories

Message.HandshakeAck = function (_ref7) {
  var pid = _ref7.pid;
  return new Message(MESSAGE_TYPES.HANDSHAKE_ACK, { p: pid, v: PROTOCOL_VERSION });
};

Message.Update = function (_ref8) {
  var path = _ref8.path;
  var patch = _ref8.patch;
  return new Message(MESSAGE_TYPES.UPDATE, { p: path, u: patch });
};

Message.Delete = function (_ref9) {
  var path = _ref9.path;
  return new Message(MESSAGE_TYPES.DELETE, { p: path });
};

Message.Error = function (_ref10) {
  var err = _ref10.err;
  return new Message(MESSAGE_TYPES.ERROR, { e: err });
};

_prototypeProperties(Message, null, {
  type: {
    get: function () {
      return this._type;
    },
    enumerable: true
  }
});

_.extend(Message.prototype, {
  _type: null,
  _payload: null,
  _json: null,
  _interpretation: null });

module.exports = Message;