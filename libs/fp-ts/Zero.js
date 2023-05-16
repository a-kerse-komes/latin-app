export function guard(F, P) {
    return (b) => (b ? P.of(undefined) : F.zero());
}
//# sourceMappingURL=Zero.js.map