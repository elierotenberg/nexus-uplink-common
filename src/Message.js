const _ = require('lodash-next');
const PROTOCOL_VERSION = require('./PROTOCOL_VERSION');
const MESSAGE_TYPES = require('./MESSAGE_TYPES');
const REV_MESSAGE_TYPES = _.invert(MESSAGE_TYPES);

class Message {
  constructor(type, payload) {
    _.dev(() => (REV_MESSAGE_TYPES[type] !== void 0).should.be.ok &&
      (payload === null || _.isObject(payload)).should.be.ok
    );
    _.extend(this, {
      _type: type,
      _payload: payload,
      _json: null,
      _interpretation: null,
    });
  }

  get type() {
    return this._type;
  }

  toJSON() { // lazy-memoized JSON-stringification
    if(this._json === null) {
      this._json = JSON.stringify({
        t: this._type,
        p: this._payload,
      });
    }
    return this._json;
  }

  interpret() {
    if(this._interpretation === null) {
      const { _type, _payload } = this;
      let action, clientSecret, err, params, patch, path, pid, protocol;
      if(_type === MESSAGE_TYPES.HANDSHAKE) {
        _payload.should.be.an.Object;
        clientSecret = _payload.s;
        protocol = _payload.v;
        clientSecret.should.be.a.String;
        protocol.should.be.exactly(PROTOCOL_VERSION);
        this._interpretation = { clientSecret };
      }
      else if(_type === MESSAGE_TYPES.SUBSCRIBE) {
        _payload.should.be.an.Object;
        path = _payload.p;
        path.should.be.a.String;
        this._interpretation = { path };
      }
      else if(_type === MESSAGE_TYPES.UNSUBSCRIBE) {
        _payload.should.be.an.Object;
        path = _payload.p;
        path.should.be.a.String;
        this._interpretation = { path};
      }
      else if(_type === MESSAGE_TYPES.DISPATCH) {
        _payload.should.be.an.Object;
        action = _payload.a;
        params = _payload.p;
        action.should.be.a.String;
        (params === null || _.isObject(params)).should.be.ok(`params should be 'null' or an Object.`);
        this._interpretation = { action, params };
      }
      else if(_type === MESSAGE_TYPES.HANDSHAKE_ACK) {
        _payload.should.be.an.Object;
        pid = _payload.p;
        protocol = _payload.v;
        pid.should.be.a.String;
        protocol.should.be.exactly(PROTOCOL_VERSION);
        this._interpretation = { pid };
      }
      else if(_type === MESSAGE_TYPES.UPDATE) {
        _payload.should.be.an.Object;
        path = _payload.p;
        patch = _payload.u;
        path.should.be.a.String;
        patch.should.be.a.String;
        this._interpretation = { path, patch };
      }
      else if(_type === MESSAGE_TYPES.DELETE) {
        _payload.should.be.an.Object;
        path = _payload.p;
        path.should.be.a.String;
        this._interpretation = { path };
      }
      else if(_type === MESSAGE_TYPES.ERROR) {
        _payload.should.be.an.Object;
        err = _payload.err,
        err.should.be.an.Object;
        this._interpretation = { err };
      }
      else {
        throw new Error(`Unknown message type: ${_type}`);
      }
    }
    return this._interpretation;
  }

  static fromJSON(json) {
    _.dev(() => json.should.be.a.String);
    const { t, p } = JSON.parse(json);
    return new Message(t, p);
  }

  // Client -> Server factories

  static Handshake({ clientSecret }) {
    return new Message(MESSAGE_TYPES.HANDSHAKE, { s: clientSecret, v: PROTOCOL_VERSION });
  }

  static Subscribe({ path }) {
    return new Message(MESSAGE_TYPES.SUBSCRIBE, { p: path });
  }

  static Unsubscribe({ path }) {
    return new Message(MESSAGE_TYPES.UNSUBSCRIBE, { p: path });
  }

  static Dispatch({ action, params }) {
    return new Message(MESSAGE_TYPES.DISPATCH, { a: action, p: params });
  }

  // Server -> Client factories

  static HandshakeAck({ pid }) {
    return new Message(MESSAGE_TYPES.HANDSHAKE_ACK, { p: pid, v: PROTOCOL_VERSION });
  }

  static Update({ path, patch }) {
    return new Message(MESSAGE_TYPES.UPDATE, { p: path, u: patch });
  }

  static Delete({ path }) {
    return new Message(MESSAGE_TYPES.DELETE, { p: path });
  }

  static Error({ err }) {
    return new Message(MESSAGE_TYPES.ERROR, { e: err });
  }
}

_.extend(Message.prototype, {
  _type: null,
  _payload: null,
  _json: null,
  _interpretation: null,
});

module.exports = Message;
