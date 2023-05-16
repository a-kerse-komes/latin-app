/**
 * Lift a computation from the `Task` monad
 *
 * @since 2.10.0
 */
import { chainFirst } from './Chain.js';
import { flow } from './function.js';
export function fromTaskK(F) {
    return (f) => flow(f, F.fromTask);
}
export function chainTaskK(F, M) {
    return (f) => {
        const g = flow(f, F.fromTask);
        return (first) => M.chain(first, g);
    };
}
export function chainFirstTaskK(F, M) {
    const chainFirstM = chainFirst(M);
    return (f) => chainFirstM(flow(f, F.fromTask));
}
//# sourceMappingURL=FromTask.js.map