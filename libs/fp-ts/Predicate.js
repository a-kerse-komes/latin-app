import { constFalse, constTrue, flow, pipe } from './function.js';
const contramap_ = (predicate, f) => pipe(predicate, contramap(f));
/**
 * @since 2.11.0
 */
export const contramap = (f) => (predicate) => flow(f, predicate);
/**
 * @category type lambdas
 * @since 2.11.0
 */
export const URI = 'Predicate';
/**
 * @category instances
 * @since 2.11.0
 */
export const getSemigroupAny = () => ({
    concat: (first, second) => pipe(first, or(second))
});
/**
 * @category instances
 * @since 2.11.0
 */
export const getMonoidAny = () => ({
    concat: getSemigroupAny().concat,
    empty: constFalse
});
/**
 * @category instances
 * @since 2.11.0
 */
export const getSemigroupAll = () => ({
    concat: (first, second) => pipe(first, and(second))
});
/**
 * @category instances
 * @since 2.11.0
 */
export const getMonoidAll = () => ({
    concat: getSemigroupAll().concat,
    empty: constTrue
});
/**
 * @category instances
 * @since 2.11.0
 */
export const Contravariant = {
    URI,
    contramap: contramap_
};
// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------
/**
 * @since 2.11.0
 */
export const not = (predicate) => (a) => !predicate(a);
/**
 * @since 2.11.0
 */
export const or = (second) => (first) => (a) => first(a) || second(a);
/**
 * @since 2.11.0
 */
export const and = (second) => (first) => (a) => first(a) && second(a);
//# sourceMappingURL=Predicate.js.map