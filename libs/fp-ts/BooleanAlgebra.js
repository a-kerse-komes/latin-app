/**
 * Boolean algebras are Heyting algebras with the additional constraint that the law of the excluded middle is true
 * (equivalently, double-negation is true).
 *
 * Instances should satisfy the following laws in addition to the `HeytingAlgebra` laws:
 *
 * - Excluded middle: `a ∨ ¬a <-> 1`
 *
 * Boolean algebras generalize classical logic: one is equivalent to "true" and zero is equivalent to "false".
 *
 * @since 2.0.0
 */
import { getBooleanAlgebra } from './function.js';
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * Every boolean algebras has a dual algebra, which involves reversing one/zero as well as join/meet.
 *
 * @since 2.10.0
 */
export const reverse = (B) => ({
    meet: (x, y) => B.join(x, y),
    join: (x, y) => B.meet(x, y),
    zero: B.one,
    one: B.zero,
    implies: (x, y) => B.join(B.not(x), y),
    not: B.not
});
// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------
/**
 * @category instances
 * @since 2.0.0
 */
export const booleanAlgebraVoid = {
    meet: () => undefined,
    join: () => undefined,
    zero: undefined,
    one: undefined,
    implies: () => undefined,
    not: () => undefined
};
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
export const getDualBooleanAlgebra = reverse;
/**
 * Use [`BooleanAlgebra`](./boolean.ts.html#booleanalgebra) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const booleanAlgebraBoolean = {
    meet: (x, y) => x && y,
    join: (x, y) => x || y,
    zero: false,
    one: true,
    implies: (x, y) => !x || y,
    not: (x) => !x
};
/**
 * Use [`getBooleanAlgebra`](./function.ts.html#getbooleanalgebra) instead.
 *
 * @category zone of death
 * @since 2.0.0
 * @deprecated
 */
export const getFunctionBooleanAlgebra = getBooleanAlgebra;
//# sourceMappingURL=BooleanAlgebra.js.map