/**
 * Less strict version of [`match`](#match).
 *
 * The `W` suffix (short for **W**idening) means that the handler return types will be merged.
 *
 * @category pattern matching
 * @since 2.12.0
 */
export const matchW = (onLessThan, onEqual, onGreaterThan) => (o) => o === -1 ? onLessThan() : o === 0 ? onEqual() : onGreaterThan();
/**
 * @category pattern matching
 * @since 2.10.0
 */
export const match = matchW;
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 2.10.0
 */
export const reverse = (o) => (o === -1 ? 1 : o === 1 ? -1 : 0);
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
export const Eq = {
    equals: (x, y) => x === y
};
/**
 * @category instances
 * @since 2.10.0
 */
export const Semigroup = {
    concat: (x, y) => (x !== 0 ? x : y)
};
/**
 * @category instances
 * @since 2.10.0
 */
export const Monoid = {
    concat: Semigroup.concat,
    empty: 0
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.0.0
 */
export const sign = (n) => (n <= -1 ? -1 : n >= 1 ? 1 : 0);
// -------------------------------------------------------------------------------------
// deprecated
// -------------------------------------------------------------------------------------
/**
 * Use [`reverse`](#reverse) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const invert = reverse;
/**
 * Use [`Semigroup`](#semigroup) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const semigroupOrdering = Semigroup;
/**
 * Use [`Eq`](#eq) instead
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const eqOrdering = Eq;
/**
 * Use [`Monoid`](#monoid) instead
 *
 * @category zone of death
 * @since 2.4.0
 * @deprecated
 */
export const monoidOrdering = Monoid;
//# sourceMappingURL=Ordering.js.map