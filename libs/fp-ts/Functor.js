/**
 * A `Functor` is a type constructor which supports a mapping operation `map`.
 *
 * `map` can be used to turn functions `a -> b` into functions `f a -> f b` whose argument and return types use the type
 * constructor `f` to represent some computational context.
 *
 * Instances must satisfy the following laws:
 *
 * 1. Identity: `F.map(fa, a => a) <-> fa`
 * 2. Composition: `F.map(fa, a => bc(ab(a))) <-> F.map(F.map(fa, ab), bc)`
 *
 * @since 2.0.0
 */
import { pipe } from './function.js';
export function map(F, G) {
    return (f) => (fa) => F.map(fa, (ga) => G.map(ga, f));
}
export function flap(F) {
    return (a) => (fab) => F.map(fab, (f) => f(a));
}
export function bindTo(F) {
    return (name) => (fa) => F.map(fa, (a) => ({ [name]: a }));
}
function let_(F) {
    return (name, f) => (fa) => F.map(fa, (a) => Object.assign({}, a, { [name]: f(a) }));
}
export { 
/**
 * @since 2.13.0
 */
let_ as let };
/** @deprecated */
export function getFunctorComposition(F, G) {
    const _map = map(F, G);
    return {
        map: (fga, f) => pipe(fga, _map(f))
    };
}
//# sourceMappingURL=Functor.js.map