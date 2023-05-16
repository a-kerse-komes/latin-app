// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * @category refinements
 * @since 2.11.0
 */
export const isBoolean = (u) => typeof u === 'boolean';
/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const matchW = (onFalse, onTrue) => (value) => value ? onTrue() : onFalse();
/**
 * Alias of [`matchW`](#matchw).
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const foldW = matchW;
/**
 * Defines the fold over a boolean value.
 * Takes two thunks `onTrue`, `onFalse` and a `boolean` value.
 * If `value` is false, `onFalse()` is returned, otherwise `onTrue()`.
 *
 * @example
 * import { some, map } from 'fp-ts/Option'
 * import { pipe } from 'fp-ts/function'
 * import { match } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(
 *  pipe(
 *    some(true),
 *    map(match(() => 'false', () => 'true'))
 *  ),
 *  some('true')
 * )
 *
 * @category pattern matching
 * @since 2.10.0
 */
export const match = foldW;
/**
 * Alias of [`match`](#match).
 *
 * @category pattern matching
 * @since 2.2.0
 */
export const fold = match;
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
export const Eq = {
    equals: (first, second) => first === second
};
/**
 * @category instances
 * @since 2.10.0
 */
export const BooleanAlgebra = {
    meet: (first, second) => first && second,
    join: (first, second) => first || second,
    zero: false,
    one: true,
    implies: (first, second) => !first || second,
    not: (b) => !b
};
/**
 * `boolean` semigroup under conjunction.
 *
 * @example
 * import { SemigroupAll } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(SemigroupAll.concat(true, true), true)
 * assert.deepStrictEqual(SemigroupAll.concat(true, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
export const SemigroupAll = {
    concat: (first, second) => first && second
};
/**
 * `boolean` semigroup under disjunction.
 *
 * @example
 * import { SemigroupAny } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(SemigroupAny.concat(true, true), true)
 * assert.deepStrictEqual(SemigroupAny.concat(true, false), true)
 * assert.deepStrictEqual(SemigroupAny.concat(false, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
export const SemigroupAny = {
    concat: (first, second) => first || second
};
/**
 * `boolean` monoid under conjunction.
 *
 * The `empty` value is `true`.
 *
 * @example
 * import { MonoidAll } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(MonoidAll.concat(true, true), true)
 * assert.deepStrictEqual(MonoidAll.concat(true, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
export const MonoidAll = {
    concat: SemigroupAll.concat,
    empty: true
};
/**
 * `boolean` monoid under disjunction.
 *
 * The `empty` value is `false`.
 *
 * @example
 * import { MonoidAny } from 'fp-ts/boolean'
 *
 * assert.deepStrictEqual(MonoidAny.concat(true, true), true)
 * assert.deepStrictEqual(MonoidAny.concat(true, false), true)
 * assert.deepStrictEqual(MonoidAny.concat(false, false), false)
 *
 * @category instances
 * @since 2.10.0
 */
export const MonoidAny = {
    concat: SemigroupAny.concat,
    empty: false
};
/**
 * @category instances
 * @since 2.10.0
 */
export const Ord = {
    equals: Eq.equals,
    compare: (first, second) => (first < second ? -1 : first > second ? 1 : 0)
};
/**
 * @category instances
 * @since 2.10.0
 */
export const Show = {
    show: (b) => JSON.stringify(b)
};
//# sourceMappingURL=boolean.js.map