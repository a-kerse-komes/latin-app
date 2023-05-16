/**
 * A `FunctorWithIndex` is a type constructor which supports a mapping operation `mapWithIndex`.
 *
 * `mapWithIndex` can be used to turn functions `i -> a -> b` into functions `f a -> f b` whose argument and return types use the type
 * constructor `f` to represent some computational context.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Identity: `F.mapWithIndex(fa, (_i, a) => a) <-> fa`
 * 2. Composition: `F.mapWithIndex(fa, (_i, a) => bc(ab(a))) <-> F.mapWithIndex(F.mapWithIndex(fa, ab), bc)`
 *
 * @since 2.0.0
 */
import { pipe } from './function.js';
import { getFunctorComposition } from './Functor.js';
export function mapWithIndex(F, G) {
    return (f) => (fa) => F.mapWithIndex(fa, (i, ga) => G.mapWithIndex(ga, (j, a) => f([i, j], a)));
}
/** @deprecated */
export function getFunctorWithIndexComposition(F, G) {
    const map = getFunctorComposition(F, G).map;
    const _mapWithIndex = mapWithIndex(F, G);
    return {
        map,
        mapWithIndex: (fga, f) => pipe(fga, _mapWithIndex(f))
    };
}
//# sourceMappingURL=FunctorWithIndex.js.map