type LoopLagSnapshot = {
    delMinMs: number;
    delMaxMs: number;
    delAvgMs: number;
    loopCount: number;
    totalTimeMs: number;
};
declare const looplag: () => {
    take: () => LoopLagSnapshot;
    stop: () => LoopLagSnapshot;
};
declare const during: (fn: () => Promise<unknown>) => Promise<{
    snapshot: LoopLagSnapshot;
    returnValue: any;
    exception: any;
}>;

export { type LoopLagSnapshot, during, looplag };
