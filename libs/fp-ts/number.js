// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------
/**
 * @category refinements
 * @since 2.11.0
 */
export const isNumber = (u) => typeof u === 'number';
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
export const Ord = {
    equals: Eq.equals,
    compare: (first, second) => (first < second ? -1 : first > second ? 1 : 0)
};
/**
 * @category instances
 * @since 2.10.0
 */
export const Bounded = {
    equals: Eq.equals,
    compare: Ord.compare,
    top: Infinity,
    bottom: -Infinity
};
/**
 * @category instances
 * @since 2.10.0
 */
export const Show = {
    show: (n) => JSON.stringify(n)
};
/**
 * @category instances
 * @since 2.11.0
 */
export const MagmaSub = {
    concat: (first, second) => first - second
};
/**
 * `number` semigroup under addition.
 *
 * @example
 * import { SemigroupSum } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(SemigroupSum.concat(2, 3), 5)
 *
 * @category instances
 * @since 2.10.0
 */
export const SemigroupSum = {
    concat: (first, second) => first + second
};
/**
 * `number` semigroup under multiplication.
 *
 * @example
 * import { SemigroupProduct } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(SemigroupProduct.concat(2, 3), 6)
 *
 * @category instances
 * @since 2.10.0
 */
export const SemigroupProduct = {
    concat: (first, second) => first * second
};
/**
 * `number` monoid under addition.
 *
 * The `empty` value is `0`.
 *
 * @example
 * import { MonoidSum } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(MonoidSum.concat(2, MonoidSum.empty), 2)
 *
 * @category instances
 * @since 2.10.0
 */
export const MonoidSum = {
    concat: SemigroupSum.concat,
    empty: 0
};
/**
 * `number` monoid under multiplication.
 *
 * The `empty` value is `1`.
 *
 * @example
 * import { MonoidProduct } from 'fp-ts/number'
 *
 * assert.deepStrictEqual(MonoidProduct.concat(2, MonoidProduct.empty), 2)
 *
 * @category instances
 * @since 2.10.0
 */
export const MonoidProduct = {
    concat: SemigroupProduct.concat,
    empty: 1
};
/**
 * @category instances
 * @since 2.10.0
 */
export const Field = {
    add: SemigroupSum.concat,
    zero: 0,
    mul: SemigroupProduct.concat,
    one: 1,
    sub: MagmaSub.concat,
    degree: (_) => 1,
    div: (first, second) => first / second,
    mod: (first, second) => first % second
};
//# sourceMappingURL=number.js.map