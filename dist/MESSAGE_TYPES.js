"use strict";

require("6to5/polyfill");var Promise = (global || window).Promise = require("lodash-next").Promise;var __DEV__ = process.env.NODE_ENV !== "production";var __PROD__ = !__DEV__;var __BROWSER__ = typeof window === "object";var __NODE__ = !__BROWSER__;module.exports = {
  // Client -> Server
  HANDSHAKE: "h",
  SUBSCRIBE: "s",
  UNSUBSCRIBE: "us",
  DISPATCH: "d",
  // Server -> Client
  HANDSHAKE_ACK: "ha",
  UPDATE: "u",
  DELETE: "D",
  ERROR: "e" };