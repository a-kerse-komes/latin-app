import { max, min } from './Ord.js';
// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------
/**
 * @category constructors
 * @since 2.0.0
 */
export function getMinMaxDistributiveLattice(O) {
    return {
        meet: min(O),
        join: max(O)
    };
}
//# sourceMappingURL=DistributiveLattice.js.map