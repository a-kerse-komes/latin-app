import * as Se from './Semigroup.js';
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.11.0
 */
export const Semigroup = Se.constant(undefined);
/**
 * @category instances
 * @since 2.11.0
 */
export const Monoid = {
    concat: Semigroup.concat,
    empty: undefined
};
//# sourceMappingURL=void.js.map