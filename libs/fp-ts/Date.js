import { pipe } from './function.js';
import * as N from './number.js';
import * as O from './Ord.js';
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.10.0
 */
export const Eq = {
    equals: (first, second) => first.valueOf() === second.valueOf()
};
/**
 * @category instances
 * @since 2.6.0
 */
export const eqDate = {
    equals: (x, y) => x.getDate() === y.getDate()
};
/**
 * @category instances
 * @since 2.6.0
 */
export const eqMonth = {
    equals: (x, y) => x.getMonth() === y.getMonth()
};
/**
 * @category instances
 * @since 2.6.0
 */
export const eqYear = {
    equals: (x, y) => x.getFullYear() === y.getFullYear()
};
/**
 * @example
 * import { Ord } from 'fp-ts/Date'
 *
 * assert.deepStrictEqual(Ord.compare(new Date(1, 1, 2020), new Date(1, 1, 2021)), -1)
 *
 * @category instances
 * @since 2.10.0
 */
export const Ord = /*#__PURE__*/ pipe(N.Ord, 
/*#__PURE__*/ O.contramap((date) => date.valueOf()));
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Returns the current `Date`
 *
 * @category constructors
 * @since 2.0.0
 */
export const create = () => new Date();
/**
 * Returns the number of milliseconds elapsed since January 1, 1970, 00:00:00 UTC
 *
 * @since 2.0.0
 */
export const now = () => new Date().getTime();
//# sourceMappingURL=Date.js.map