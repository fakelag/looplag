## Looplag

A NodeJS event loop benchmarking library.

### Install
```
npm install looplag
```

### Usage
```typescript
import { looplag } from 'looplag';

const something = async () => {
    const lag = looplag();

    await heavyAsyncFunction();

    const snapshot = lag.stop();

    console.log({
        delMinMs: snapshot.delMinMs,
        delMaxMs: snapshot.delMaxMs,
        delAvgMs: snapshot.delAvgMs,
        loopCount: snapshot.loopCount,
        totalTimeMs: snapshot.totalTimeMs,
    });
};
```

```typescript
import { during } from 'looplag';

const something = async () => {
    const { returnValue, exception, snapshot } = await during(
        heavyAsyncFunction,
    );

    expect(exception).not.toBeDefined();
    expect(returnValue).toBeDefined();
    expect(returnValue).toHaveLength(inp.length);

    expect(snapshot.loopCount).toBeGreaterThan(100);
    expect(snapshot.delAvgMs).toBeLessThan(10);
};
```
