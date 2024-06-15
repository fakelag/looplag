"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  during: () => during,
  looplag: () => looplag
});
module.exports = __toCommonJS(src_exports);
var looplag = () => {
  const curtime = () => {
    const hrtime = process.hrtime();
    return hrtime[0] * 1e3 + hrtime[1] / 1e6;
  };
  const intervalMs = 1;
  let loopStart = curtime();
  let stop = false;
  let loopCount = 0;
  let delMinMs = 0;
  let delMaxMs = 0;
  let delSumMs = 0;
  let timeoutId;
  const start = loopStart;
  const loop = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const time = curtime();
    const delayMs = Math.max(0, time - loopStart - intervalMs);
    loopStart = time;
    ++loopCount;
    delSumMs += delayMs;
    if (delMinMs > delayMs) delMinMs = delayMs;
    if (delMaxMs < delayMs) delMaxMs = delayMs;
    if (stop) {
      return;
    }
    timeoutId = setTimeout(loop, intervalMs);
  };
  timeoutId = setTimeout(loop, intervalMs);
  return {
    take: function() {
      return {
        delMinMs,
        delMaxMs,
        delAvgMs: delSumMs / loopCount,
        loopCount,
        totalTimeMs: curtime() - start
      };
    },
    stop: function() {
      stop = true;
      return this.take();
    }
  };
};
var during = async (fn) => {
  const lag = looplag();
  let returnValue;
  let exception;
  let snapshot;
  try {
    returnValue = await fn();
  } catch (err) {
    exception = err;
  } finally {
    snapshot = lag.stop();
  }
  return {
    snapshot,
    returnValue,
    exception
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  during,
  looplag
});
