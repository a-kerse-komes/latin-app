/**
 * @since 2.0.0
 */
export const tailRec = (startWith, f) => {
    let ab = f(startWith);
    while (ab._tag === 'Left') {
        ab = f(ab.left);
    }
    return ab.right;
};
//# sourceMappingURL=ChainRec.js.map