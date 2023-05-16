import { identity, pipe } from './function.js';
import { flap as flap_ } from './Functor.js';
// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------
/**
 * @since 2.5.0
 */
export function fst(ea) {
    return ea[0];
}
/**
 * @since 2.5.0
 */
export function snd(ea) {
    return ea[1];
}
/**
 * @since 2.5.0
 */
export const swap = (ea) => [snd(ea), fst(ea)];
/**
 * @category instances
 * @since 2.5.0
 */
export function getApply(S) {
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: (fab, fa) => [fst(fab)(fst(fa)), S.concat(snd(fab), snd(fa))]
    };
}
const of = (M) => (a) => {
    return [a, M.empty];
};
/**
 * @category instances
 * @since 2.5.0
 */
export function getApplicative(M) {
    const A = getApply(M);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        of: of(M)
    };
}
/**
 * @category instances
 * @since 2.5.0
 */
export function getChain(S) {
    const A = getApply(S);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: A.ap,
        chain: (ma, f) => {
            const [b, s] = f(fst(ma));
            return [b, S.concat(snd(ma), s)];
        }
    };
}
/**
 * @category instances
 * @since 2.5.0
 */
export function getMonad(M) {
    const C = getChain(M);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: C.ap,
        chain: C.chain,
        of: of(M)
    };
}
/**
 * @category instances
 * @since 2.5.0
 */
export function getChainRec(M) {
    const chainRec = (a, f) => {
        let result = f(a);
        let acc = M.empty;
        let s = fst(result);
        while (s._tag === 'Left') {
            acc = M.concat(acc, snd(result));
            result = f(s.left);
            s = fst(result);
        }
        return [s.right, M.concat(acc, snd(result))];
    };
    const C = getChain(M);
    return {
        URI,
        _E: undefined,
        map: _map,
        ap: C.ap,
        chain: C.chain,
        chainRec
    };
}
/* istanbul ignore next */
const _compose = (bc, ab) => pipe(bc, compose(ab));
/* istanbul ignore next */
const _map = (fa, f) => pipe(fa, mapFst(f));
/* istanbul ignore next */
const _bimap = (fa, f, g) => pipe(fa, bimap(f, g));
/* istanbul ignore next */
const _mapLeft = (fa, f) => pipe(fa, mapSnd(f));
/* istanbul ignore next */
const _extend = (wa, f) => pipe(wa, extend(f));
/* istanbul ignore next */
const _reduce = (fa, b, f) => pipe(fa, reduce(b, f));
/* istanbul ignore next */
const _foldMap = (M) => {
    const foldMapM = foldMap(M);
    return (fa, f) => pipe(fa, foldMapM(f));
};
/* istanbul ignore next */
const _reduceRight = (fa, b, f) => pipe(fa, reduceRight(b, f));
/* istanbul ignore next */
const _traverse = (F) => {
    const traverseF = traverse(F);
    return (ta, f) => pipe(ta, traverseF(f));
};
/**
 * Map a pair of functions over the two type arguments of the bifunctor.
 *
 * @category mapping
 * @since 2.5.0
 */
export const bimap = (f, g) => (fa) => [g(fst(fa)), f(snd(fa))];
/**
 * Map a function over the first component of a `ReadonlyTuple`.
 *
 * This is the `map` operation of the `Functor` instance.
 *
 * @category mapping
 * @since 2.10.0
 */
export const mapFst = (f) => (fa) => [f(fst(fa)), snd(fa)];
/**
 * Map a function over the second component of a `ReadonlyTuple`.
 *
 * This is the `mapLeft` operation of the `Bifunctor` instance.
 *
 * @category mapping
 * @since 2.10.0
 */
export const mapSnd = (f) => (fa) => [fst(fa), f(snd(fa))];
/**
 * @since 2.5.0
 */
export const compose = (ab) => (bc) => [fst(bc), snd(ab)];
/**
 * @since 2.5.0
 */
export const extend = (f) => (wa) => [f(wa), snd(wa)];
/**
 * @category Extract
 * @since 2.6.2
 */
export const extract = fst;
/**
 * @since 2.5.0
 */
export const duplicate = /*#__PURE__*/ extend(identity);
/**
 * @category folding
 * @since 2.5.0
 */
export const reduce = (b, f) => (fa) => f(b, fst(fa));
/**
 * @category folding
 * @since 2.5.0
 */
export const foldMap = () => {
    return (f) => (fa) => f(fst(fa));
};
/**
 * @category folding
 * @since 2.5.0
 */
export const reduceRight = (b, f) => (fa) => f(fst(fa), b);
/**
 * @category traversing
 * @since 2.6.3
 */
export const traverse = (F) => {
    return (f) => (ta) => F.map(f(fst(ta)), (b) => [b, snd(ta)]);
};
/**
 * @category traversing
 * @since 2.6.3
 */
export const sequence = (F) => (fas) => {
    return F.map(fst(fas), (a) => [a, snd(fas)]);
};
/**
 * @category type lambdas
 * @since 2.5.0
 */
export const URI = 'ReadonlyTuple';
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
/**
 * Alias of [`mapFst`](#mapfst).
 *
 * @category mapping
 * @since 2.5.0
 */
export const map = mapFst;
/**
 * Alias of [`mapSnd`](#mapsnd).
 *
 * @category error handling
 * @since 2.5.0
 */
export const mapLeft = mapSnd;
/**
 * @category instances
 * @since 2.7.0
 */
export const Bifunctor = {
    URI,
    bimap: _bimap,
    mapLeft: _mapLeft
};
/**
 * @category instances
 * @since 2.7.0
 */
export const Semigroupoid = {
    URI,
    compose: _compose
};
/**
 * @category instances
 * @since 2.7.0
 */
export const Comonad = {
    URI,
    map: _map,
    extend: _extend,
    extract
};
/**
 * @category instances
 * @since 2.7.0
 */
export const Foldable = {
    URI,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight
};
/**
 * @category instances
 * @since 2.7.0
 */
export const Traversable = {
    URI,
    map: _map,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Functor` instance, pass `RT.Functor` instead of `RT.readonlyTuple`
 * (where `RT` is from `import RT from 'fp-ts/ReadonlyTuple'`)
 *
 * @category zone of death
 * @since 2.5.0
 * @deprecated
 */
export const readonlyTuple = {
    URI,
    compose: _compose,
    map: _map,
    bimap: _bimap,
    mapLeft: _mapLeft,
    extract,
    extend: _extend,
    reduce: _reduce,
    foldMap: _foldMap,
    reduceRight: _reduceRight,
    traverse: _traverse,
    sequence
};
//# sourceMappingURL=ReadonlyTuple.js.map