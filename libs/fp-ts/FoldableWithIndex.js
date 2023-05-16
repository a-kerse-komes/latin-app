/**
 * A `Foldable` with an additional index.
 * A `FoldableWithIndex` instance must be compatible with its `Foldable` instance
 *
 * ```ts
 * reduce(fa, b, f) = reduceWithIndex(fa, b, (_, b, a) => f(b, a))
 * foldMap(M)(fa, f) = foldMapWithIndex(M)(fa, (_, a) => f(a))
 * reduceRight(fa, b, f) = reduceRightWithIndex(fa, b, (_, a, b) => f(a, b))
 * ```
 *
 * @since 2.0.0
 */
import { getFoldableComposition } from './Foldable.js';
import { pipe } from './function.js';
export function reduceWithIndex(F, G) {
    return (b, f) => (fga) => F.reduceWithIndex(fga, b, (i, b, ga) => G.reduceWithIndex(ga, b, (j, b, a) => f([i, j], b, a)));
}
export function foldMapWithIndex(F, G) {
    return (M) => {
        const foldMapWithIndexF = F.foldMapWithIndex(M);
        const foldMapWithIndexG = G.foldMapWithIndex(M);
        return (f) => (fga) => foldMapWithIndexF(fga, (i, ga) => foldMapWithIndexG(ga, (j, a) => f([i, j], a)));
    };
}
export function reduceRightWithIndex(F, G) {
    return (b, f) => (fga) => F.reduceRightWithIndex(fga, b, (i, ga, b) => G.reduceRightWithIndex(ga, b, (j, a, b) => f([i, j], a, b)));
}
/** @deprecated */
export function getFoldableWithIndexComposition(F, G) {
    const FC = getFoldableComposition(F, G);
    const _reduceWithIndex = reduceWithIndex(F, G);
    const _foldMapWithIndex = foldMapWithIndex(F, G);
    const _reduceRightWithIndex = reduceRightWithIndex(F, G);
    return {
        reduce: FC.reduce,
        foldMap: FC.foldMap,
        reduceRight: FC.reduceRight,
        reduceWithIndex: (fga, b, f) => pipe(fga, _reduceWithIndex(b, f)),
        foldMapWithIndex: (M) => {
            const foldMapWithIndexM = _foldMapWithIndex(M);
            return (fga, f) => pipe(fga, foldMapWithIndexM(f));
        },
        reduceRightWithIndex: (fga, b, f) => pipe(fga, _reduceRightWithIndex(b, f))
    };
}
//# sourceMappingURL=FoldableWithIndex.js.map