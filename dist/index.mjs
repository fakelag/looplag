// src/index.ts
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
export {
  during,
  looplag
};
