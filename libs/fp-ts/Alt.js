export function altAll(F) {
    return (startWith) => (as) => as.reduce((acc, a) => F.alt(acc, () => a), startWith);
}
//# sourceMappingURL=Alt.js.map