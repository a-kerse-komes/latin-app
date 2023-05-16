export function chainFirst(M) {
    const tapM = tap(M);
    return (f) => (first) => tapM(first, f);
}
/** @internal */
export function tap(M) {
    return (first, f) => M.chain(first, (a) => M.map(f(a), () => a));
}
export function bind(M) {
    return (name, f) => (ma) => M.chain(ma, (a) => M.map(f(a), (b) => Object.assign({}, a, { [name]: b })));
}
//# sourceMappingURL=Chain.js.map