/**
 * @since 2.11.0
 */
import * as M from './Monoid.js'
import * as Se from './Semigroup.js'

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 2.11.0
 */
export const Semigroup: Se.Semigroup<void> = Se.constant<void>(undefined)

/**
 * @category instances
 * @since 2.11.0
 */
export const Monoid: M.Monoid<void> = {
  concat: Semigroup.concat,
  empty: undefined
}
