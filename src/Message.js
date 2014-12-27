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
      let action, clientSecret, params, patch, path, pid, protocol;
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
        clientSecret = _payload.s;
        path = _payload.p;
        clientSecret.should.be.a.String;
        path.should.be.a.String;
        this._interpretation = { clientSecret, path };
      }
      else if(_type === MESSAGE_TYPES.UNSUBSCRIBE) {
        _payload.should.be.an.Object;
        clientSecret = _payload.s;
        path = _payload.p;
        clientSecret.should.be.a.String;
        path.should.be.a.String;
        this._interpretation = { clientSecret, path};
      }
      else if(_type === MESSAGE_TYPES.DISPATCH) {
        _payload.should.be.an.Object;
        clientSecret = _payload.s;
        action = _payload.a;
        params = _payload.p;
        clientSecret.should.be.a.String;
        action.should.be.a.String;
        (params === null || _.isObject(params)).should.be.ok(`params should be 'null' or an Object.`);
        this._interpretation = { clientSecret, action, params };
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

  static Subscribe({ clientSecret, path }) {
    return new Message(MESSAGE_TYPES.SUBSCRIBE, { s: clientSecret, p: path });
  }

  static Unsubscribe({ clientSecret, path }) {
    return new Message(MESSAGE_TYPES.UNSUBSCRIBE, { s: clientSecret, p: path });
  }

  static Dispatch({ clientSecret, action, params }) {
    return new Message(MESSAGE_TYPES.DISPATCH, { s: clientSecret, a: action, p: params });
  }

  // Server -> Client factories

  static HandshakeAck({ pid }) {
    return new Message(MESSAGE_TYPES.HANDSHAKE_ACK, { p: pid, v: PROTOCOL_VERSION });
  }

  static Update({ path, patch }) {
    return new Message(MESSAGE_TYPES.UPDATE, { p: path, u: patch });
  }
}

_.extend(Message.prototype, {
  _type: null,
  _payload: null,
  _json: null,
  _interpretation: null,
});

module.exports = Message;
