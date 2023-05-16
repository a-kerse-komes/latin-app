/**
 * @since 2.11.0
 */
import { flow, identity } from './function.js';
/**
 * @category type lambdas
 * @since 2.11.0
 */
export const URI = 'Endomorphism';
/**
 * Endomorphism form a `Semigroup` where the `concat` operation is the usual function composition.
 *
 * @category instances
 * @since 2.11.0
 */
export const getSemigroup = () => ({
    concat: (first, second) => flow(first, second)
});
/**
 * Endomorphism form a `Monoid` where the `empty` value is the `identity` function.
 *
 * @category instances
 * @since 2.11.0
 */
export const getMonoid = () => ({
    concat: getSemigroup().concat,
    empty: identity
});
//# sourceMappingURL=Endomorphism.js.map