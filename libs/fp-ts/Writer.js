import { pipe } from './function.js';
import { flap as flap_ } from './Functor.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Appends a value to the accumulator
 *
 * @category constructors
 * @since 2.0.0
 */
export const tell = (w) => () => [undefined, w];
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Modifies the result to include the changes to the accumulator
 *
 * @since 2.0.0
 */
export const listen = (fa) => () => {
    const [a, w] = fa();
    return [[a, w], w];
};
/**
 * Applies the returned function to the accumulator
 *
 * @since 2.0.0
 */
export const pass = (fa) => () => {
    const [[a, f], w] = fa();
    return [a, f(w)];
};
/**
 * Projects a value from modifications made to the accumulator during an action
 *
 * @since 2.0.0
 */
export const listens = (f) => (fa) => () => {
    const [a, w] = fa();
    return [[a, f(w)], w];
};
/**
 * Modify the final accumulator value by applying a function
 *
 * @since 2.0.0
 */
export const censor = (f) => (fa) => () => {
    const [a, w] = fa();
    return [a, f(w)];
};
/* istanbul ignore next */
const _map = (fa, f) => pipe(fa, map(f));
/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category mapping
 * @since 2.0.0
 */
export const map = (f) => (fa) => () => {
    const [a, w] = fa();
    return [f(a), w];
};
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Writer';
/**
 * @category instances
 * @since 2.10.0
 */
export const getPointed = (M) => ({
    URI,
    _E: undefined,
    of: (a) => () => [a, M.empty]
});
/**
 * @category instances
 * @since 2.10.0
 */
export const getApply = (S) => ({
    URI,
    _E: undefined,
    map: _map,
    ap: (fab, fa) => () => {
        const [f, w1] = fab();
        const [a, w2] = fa();
        return [f(a), S.concat(w1, w2)];
    }
});
/**
 * @category instances
 * @since 2.10.0
 */
export const getApplicative = (M) => {
    const A = getApply(M);
    const P = getPointed(M);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: P.of
    };
};
/**
 * @category instances
 * @since 2.10.0
 */
export function getChain(S) {
    const A = getApply(S);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        chain: (fa, f) => () => {
            const [a, w1] = fa();
            const [b, w2] = f(a)();
            return [b, S.concat(w1, w2)];
        }
    };
}
/**
 * @category instances
 * @since 2.0.0
 */
export function getMonad(M) {
    const A = getApplicative(M);
    const C = getChain(M);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: A.of,
        chain: C.chain
    };
}
/**
 * @category instances
 * @since 2.7.0
 */
export const Functor = {
    URI,
    map: _map
};
/**
 * @category mapping
 * @since 2.10.0
 */
export const flap = /*#__PURE__*/ flap_(Functor);
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.8.0
 */
export const evaluate = (fa) => fa()[0];
/**
 * @since 2.8.0
 */
export const execute = (fa) => fa()[1];
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`evaluate`](#evaluate) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const evalWriter = (fa) => fa()[0];
/**
 * Use [`execute`](#execute) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const execWriter = (fa) => fa()[1];
/**
 * Use [`Functor`](#functor) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const writer = Functor;
//# sourceMappingURL=Writer.js.map