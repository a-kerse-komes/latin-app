/**
 * @since 2.10.0
 */
import * as _ from './internal.js';
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * Return a semigroup which works like `Object.assign`.
 *
 * @example
 * import { getAssignSemigroup } from 'fp-ts/struct'
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 *
 * const S = getAssignSemigroup<Person>()
 * assert.deepStrictEqual(S.concat({ name: 'name', age: 23 }, { name: 'name', age: 24 }), { name: 'name', age: 24 })
 *
 * @category instances
 * @since 2.10.0
 */
export const getAssignSemigroup = () => ({
    concat: (first, second) => Object.assign({}, first, second)
});
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * Creates a new object by recursively evolving a shallow copy of `a`, according to the `transformation` functions.
 *
 * @example
 * import { pipe } from 'fp-ts/function'
 * import { evolve } from 'fp-ts/struct'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     { a: 'a', b: 1 },
 *     evolve({
 *       a: (a) => a.length,
 *       b: (b) => b * 2
 *     })
 *   ),
 *   { a: 1, b: 2 }
 * )
 *
 * @since 2.11.0
 */
export const evolve = (transformations) => (a) => {
    const out = {};
    for (const k in a) {
        if (_.has.call(a, k)) {
            out[k] = transformations[k](a[k]);
        }
    }
    return out;
};
//# sourceMappingURL=struct.js.map