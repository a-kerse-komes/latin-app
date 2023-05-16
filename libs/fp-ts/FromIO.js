/**
 * Lift a computation from the `IO` monad
 *
 * @since 2.10.0
 */
import { chainFirst } from './Chain.js';
import { flow } from './function.js';
export function fromIOK(F) {
    return (f) => flow(f, F.fromIO);
}
export function chainIOK(F, M) {
    return (f) => {
        const g = flow(f, F.fromIO);
        return (first) => M.chain(first, g);
    };
}
export function chainFirstIOK(F, M) {
    const chainFirstM = chainFirst(M);
    return (f) => chainFirstM(flow(f, F.fromIO));
}
//# sourceMappingURL=FromIO.js.map