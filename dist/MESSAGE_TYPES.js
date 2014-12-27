"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;module.exports = {
  HANDSHAKE: "h",
  HANDSHAKE_ACK: "ha",
  SUBSCRIBE_TO: "s",
  UNSUBSCRIBE_FROM: "us",
  LISTEN_TO: "l",
  UNLISTEN_FROM: "ul",
  DISPATCH: "d",
  UPDATE: "u",
  EMIT: "e" };