export function getWriterM(M) {
    const map = (fa, f) => () => M.map(fa(), ([a, w]) => [f(a), w]);
    return {
        map,
        evalWriter: (fa) => M.map(fa(), ([a]) => a),
        execWriter: (fa) => M.map(fa(), ([_, w]) => w),
        tell: (w) => () => M.of([undefined, w]),
        listen: (fa) => () => M.map(fa(), ([a, w]) => [[a, w], w]),
        pass: (fa) => () => M.map(fa(), ([[a, f], w]) => [a, f(w)]),
        listens: (fa, f) => () => M.map(fa(), ([a, w]) => [[a, f(w)], w]),
        censor: (fa, f) => () => M.map(fa(), ([a, w]) => [a, f(w)]),
        getMonad: (W) => {
            return {
                _E: undefined,
                map,
                of: (a) => () => M.of([a, W.empty]),
                ap: (mab, ma) => () => M.chain(mab(), ([f, w1]) => M.map(ma(), ([a, w2]) => [f(a), W.concat(w1, w2)])),
                chain: (ma, f) => () => M.chain(ma(), ([a, w1]) => M.map(f(a)(), ([b, w2]) => [b, W.concat(w1, w2)]))
            };
        }
    };
}
//# sourceMappingURL=WriterT.js.map