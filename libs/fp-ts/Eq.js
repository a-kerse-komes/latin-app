import { pipe } from './function.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export const fromEquals = (equals) => ({
    equals: (x, y) => x === y || equals(x, y)
});
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
export const struct = (eqs) => fromEquals((first, second) => {
    for (const key in eqs) {
        if (!eqs[key].equals(first[key], second[key])) {
            return false;
        }
    }
    return true;
});
/**
 * Given a tuple of `Eq`s returns a `Eq` for the tuple
 *
 * @example
 * import { tuple } from 'fp-ts/Eq'
 * import * as S from 'fp-ts/string'
 * import * as N from 'fp-ts/number'
 * import * as B from 'fp-ts/boolean'
 *
 * const E = tuple(S.Eq, N.Eq, B.Eq)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, true]), true)
 * assert.strictEqual(E.equals(['a', 1, true], ['b', 1, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 2, true]), false)
 * assert.strictEqual(E.equals(['a', 1, true], ['a', 1, false]), false)
 *
 * @since 2.10.0
 */
export const tuple = (...eqs) => fromEquals((first, second) => eqs.every((E, i) => E.equals(first[i], second[i])));
/* istanbul ignore next */
const contramap_ = (fa, f) => pipe(fa, contramap(f));
/**
 * A typical use case for `contramap` would be like, given some `User` type, to construct an `Eq<User>`.
 *
 * We can do so with a function from `User -> X` where `X` is some value that we know how to compare
 * for equality (meaning we have an `Eq<X>`)
 *
 * For example, given the following `User` type, we want to construct an `Eq<User>` that just looks at the `key` field
 * for each user (since it's known to be unique).
 *
 * If we have a way of comparing `UUID`s for equality (`eqUUID: Eq<UUID>`) and we know how to go from `User -> UUID`,
 * using `contramap` we can do this
 *
 * @example
 * import { contramap, Eq } from 'fp-ts/Eq'
 * import { pipe } from 'fp-ts/function'
 * import * as S from 'fp-ts/string'
 *
 * type UUID = string
 *
 * interface User {
 *   readonly key: UUID
 *   readonly firstName: string
 *   readonly lastName: string
 * }
 *
 * const eqUUID: Eq<UUID> = S.Eq
 *
 * const eqUserByKey: Eq<User> = pipe(
 *   eqUUID,
 *   contramap((user) => user.key)
 * )
 *
 * assert.deepStrictEqual(
 *   eqUserByKey.equals(
 *     { key: 'k1', firstName: 'a1', lastName: 'b1' },
 *     { key: 'k2', firstName: 'a1', lastName: 'b1' }
 *   ),
 *   false
 * )
 * assert.deepStrictEqual(
 *   eqUserByKey.equals(
 *     { key: 'k1', firstName: 'a1', lastName: 'b1' },
 *     { key: 'k1', firstName: 'a2', lastName: 'b1' }
 *   ),
 *   true
 * )
 *
 * @since 2.0.0
 */
export const contramap = (f) => (fa) => fromEquals((x, y) => fa.equals(f(x), f(y)));
/**
 * @category type lambdas
 * @since 2.0.0
 */
export const URI = 'Eq';
/**
 * @category instances
 * @since 2.5.0
 */
export const eqStrict = {
    equals: (a, b) => a === b
};
const empty = {
    equals: () => true
};
/**
 * @category instances
 * @since 2.10.0
 */
export const getSemigroup = () => ({
    concat: (x, y) => fromEquals((a, b) => x.equals(a, b) && y.equals(a, b))
});
/**
 * @category instances
 * @since 2.6.0
 */
export const getMonoid = () => ({
    concat: getSemigroup().concat,
    empty
});
/**
 * @category instances
 * @since 2.7.0
 */
export const Contravariant = {
    URI,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`tuple`](#tuple) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getTupleEq = tuple;
/**
 * Use [`struct`](#struct) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getStructEq = struct;
/**
 * Use [`eqStrict`](#eqstrict) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const strictEqual = eqStrict.equals;
/**
 * This instance is deprecated, use small, specific instances instead.
 * For example if a function needs a `Contravariant` instance, pass `E.Contravariant` instead of `E.eq`
 * (where `E` is from `import E from 'fp-ts/Eq'`)
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const eq = Contravariant;
/**
 * Use [`Eq`](./boolean.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const eqBoolean = eqStrict;
/**
 * Use [`Eq`](./string.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const eqString = eqStrict;
/**
 * Use [`Eq`](./number.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const eqNumber = eqStrict;
/**
 * Use [`Eq`](./Date.ts.html#eq) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const eqDate = {
    equals: (first, second) => first.valueOf() === second.valueOf()
};
//# sourceMappingURL=Eq.js.map