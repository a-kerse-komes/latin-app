/**
 * Lift a computation from the `Reader` monad.
 *
 * @since 2.11.0
 */
import { chainFirst } from './Chain.js';
import { flow } from './function.js';
import * as R from './Reader.js';
export function ask(F) {
    return () => F.fromReader(R.ask());
}
export function asks(F) {
    return F.fromReader;
}
export function fromReaderK(F) {
    return (f) => flow(f, F.fromReader);
}
export function chainReaderK(F, M) {
    const fromReaderKF = fromReaderK(F);
    return (f) => (ma) => M.chain(ma, fromReaderKF(f));
}
export function chainFirstReaderK(F, M) {
    return flow(fromReaderK(F), chainFirst(M));
}
//# sourceMappingURL=FromReader.js.map