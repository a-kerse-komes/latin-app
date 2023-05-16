import { getMonoid as getEM } from './Endomorphism.js';
import { getMonoid as getFM } from './function.js';
import * as _ from './internal.js';
import * as Se from './Semigroup.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Get a monoid where `concat` will return the minimum, based on the provided bounded order.
 *
 * The `empty` value is the `top` value.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as M from 'fp-ts/Monoid'
 *
 * const M1 = M.min(N.Bounded)
 *
 * assert.deepStrictEqual(M1.concat(1, 2), 1)
 *
 * @category constructors
 * @since 2.10.0
 */
export const min = (B) => ({
    concat: Se.min(B).concat,
    empty: B.top
});
/**
 * Get a monoid where `concat` will return the maximum, based on the provided bounded order.
 *
 * The `empty` value is the `bottom` value.
 *
 * @example
 * import * as N from 'fp-ts/number'
 * import * as M from 'fp-ts/Monoid'
 *
 * const M1 = M.max(N.Bounded)
 *
 * assert.deepStrictEqual(M1.concat(1, 2), 2)
 *
 * @category constructors
 * @since 2.10.0
 */
export const max = (B) => ({
    concat: Se.max(B).concat,
    empty: B.bottom
});
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * The dual of a `Monoid`, obtained by swapping the arguments of `concat`.
 *
 * @example
 * import { reverse } from 'fp-ts/Monoid'
 * import * as S from 'fp-ts/string'
 *
 * assert.deepStrictEqual(reverse(S.Monoid).concat('a', 'b'), 'ba')
 *
 * @since 2.10.0
 */
export const reverse = (M) => ({
    concat: Se.reverse(M).concat,
    empty: M.empty
});
/**
 * Given a struct of monoids returns a monoid for the struct.
 *
 * @example
 * import { struct } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * interface Point {
 *   readonly x: number
 *   readonly y: number
 * }
 *
 * const M = struct<Point>({
 *   x: N.MonoidSum,
 *   y: N.MonoidSum
 * })
 *
 * assert.deepStrictEqual(M.concat({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
 *
 * @since 2.10.0
 */
export const struct = (monoids) => {
    const empty = {};
    for (const k in monoids) {
        if (_.has.call(monoids, k)) {
            empty[k] = monoids[k].empty;
        }
    }
    return {
        concat: Se.struct(monoids).concat,
        empty
    };
};
/**
 * Given a tuple of monoids returns a monoid for the tuple.
 *
 * @example
 * import { tuple } from 'fp-ts/Monoid'
 * import * as B from 'fp-ts/boolean'
 * import * as N from 'fp-ts/number'
 * import * as S from 'fp-ts/string'
 *
 * const M1 = tuple(S.Monoid, N.MonoidSum)
 * assert.deepStrictEqual(M1.concat(['a', 1], ['b', 2]), ['ab', 3])
 *
 * const M2 = tuple(S.Monoid, N.MonoidSum, B.MonoidAll)
 * assert.deepStrictEqual(M2.concat(['a', 1, true], ['b', 2, false]), ['ab', 3, false])
 *
 * @since 2.10.0
 */
export const tuple = (...monoids) => ({
    concat: Se.tuple(...monoids).concat,
    empty: monoids.map((m) => m.empty)
});
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Given a sequence of `as`, concat them and return the total.
 *
 * If `as` is empty, return the monoid `empty` value.
 *
 * @example
 * import { concatAll } from 'fp-ts/Monoid'
 * import * as N from 'fp-ts/number'
 *
 * assert.deepStrictEqual(concatAll(N.MonoidSum)([1, 2, 3]), 6)
 * assert.deepStrictEqual(concatAll(N.MonoidSum)([]), 0)
 *
 * @since 2.10.0
 */
export const concatAll = (M) => Se.concatAll(M)(M.empty);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`Monoid`](./void.ts.html#monoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const monoidVoid = {
    concat: Se.semigroupVoid.concat,
    empty: undefined
};
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getTupleMonoid = tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getStructMonoid = struct;
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getDualMonoid = reverse;
/**
 * Use [`max`](#max) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getJoinMonoid = max;
/**
 * Use [`min`](#min) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getMeetMonoid = min;
/**
 * Use [`concatAll`](#concatall) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const fold = concatAll;
/**
 * Use [`MonoidAll`](./boolean.ts.html#monoidall) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const monoidAll = {
    concat: Se.semigroupAll.concat,
    empty: true
};
/**
 * Use [`MonoidAny`](./boolean.ts.html#monoidany) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const monoidAny = {
    concat: Se.semigroupAny.concat,
    empty: false
};
/**
 * Use [`getMonoid`](./function.ts.html#getmonoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getFunctionMonoid = getFM;
/**
 * Use [`getEndomorphismMonoid`](./function.ts.html#getendomorphismmonoid) instead.
 *
 * **Note**. The execution order in [`getEndomorphismMonoid`](./function.ts.html#getendomorphismmonoid) is reversed.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getEndomorphismMonoid = () => reverse(getEM());
/**
 * Use [`Monoid`](./string.ts.html#monoid) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const monoidString = {
    concat: Se.semigroupString.concat,
    empty: ''
};
/**
 * Use [`MonoidSum`](./number.ts.html#monoidsum) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const monoidSum = {
    concat: Se.semigroupSum.concat,
    empty: 0
};
/**
 * Use [`MonoidProduct`](./number.ts.html#monoidproduct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const monoidProduct = {
    concat: Se.semigroupProduct.concat,
    empty: 1
};
//# sourceMappingURL=Monoid.js.map