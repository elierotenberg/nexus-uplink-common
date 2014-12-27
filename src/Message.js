const _ = require('lodash-next');
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
    });
  }

  serialize() { // lazy-memoized JSON-stringification
    if(this._json === null) {
      this._json = JSON.stringify({
        t: this._type,
        p: this._payload,
      });
    }
    return this._json;
  }

  static unserialize(str) {
    _.dev(() => str.should.be.a.String);
    const { t, p } = JSON.parse(str);
    return new Message(t, p);
  }
}

_.extend(Message.prototype, {
  _type: null,
  _payload: null,
  _json: null,
});

module.exports = Message;
