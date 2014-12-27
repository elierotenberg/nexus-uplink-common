const _ = require('lodash-next');
const Remutable = require('remutable');

const PROTOCOL_VERSION = require('./PROTOCOL_VERSION');
const MESSAGE_TYPES = require('./MESSAGE_TYPES');
const Message = require('./Message');

module.exports = {
  PROTOCOL_VERSION,
  MESSAGE_TYPES,
  Message,
  Remutable,
};
