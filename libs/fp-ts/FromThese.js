/**
 * The `FromThese` type class represents those data types which support errors and warnings.
 *
 * @since 2.11.0
 */
import { flow } from './function.js';
export function fromTheseK(F) {
    return (f) => flow(f, F.fromThese);
}
//# sourceMappingURL=FromThese.js.map