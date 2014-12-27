"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;var PROTOCOL_VERSION = require("./PROTOCOL_VERSION");
var MESSAGE_TYPES = require("./MESSAGE_TYPES");
var Message = require("./Message");

module.exports = {
  PROTOCOL_VERSION: PROTOCOL_VERSION,
  MESSAGE_TYPES: MESSAGE_TYPES,
  Message: Message };