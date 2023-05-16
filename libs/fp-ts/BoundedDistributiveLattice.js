import { getMinMaxDistributiveLattice } from './DistributiveLattice.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export function getMinMaxBoundedDistributiveLattice(O) {
    const L = getMinMaxDistributiveLattice(O);
    return (min, max) => ({
        join: L.join,
        meet: L.meet,
        zero: min,
        one: max
    });
}
//# sourceMappingURL=BoundedDistributiveLattice.js.map