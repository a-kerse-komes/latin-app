import * as _ from './internal.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * Returns a `Refinement` from a `Option` returning function.
 * This function ensures that a `Refinement` definition is type-safe.
 *
 * @category lifting
 * @since 2.11.0
 */
export const fromOptionK = (getOption) => {
    return (a) => _.isSome(getOption(a));
};
/**
 * @category lifting
 * @since 2.11.0
 */
export const fromEitherK = (getEither) => {
    return (a) => _.isRight(getEither(a));
};
/**
 * @category constructors
 * @since 2.11.0
 */
export const id = () => {
    return (_) => true;
};
// -------------------------------------------------------------------------------------
// combinators
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
export const not = (refinement) => (a) => !refinement(a);
/**
 * @since 2.11.0
 */
export const or = (second) => (first) => (a) => first(a) || second(a);
/**
 * @since 2.11.0
 */
export const and = (second) => (first) => (a) => first(a) && second(a);
/**
 * @since 2.11.0
 */
export const zero = () => {
    return (_) => false;
};
/**
 * @since 2.11.0
 */
export const compose = (bc) => (ab) => {
    return (i) => ab(i) && bc(i);
};
//# sourceMappingURL=Refinement.js.map