/**
 * @example
 * import { flatMap } from 'fp-ts/IO'
 * import { newIORef } from 'fp-ts/IORef'
 *
 * assert.strictEqual(flatMap(newIORef(1), ref => flatMap(ref.write(2), () => ref.read))(), 2)
 *
 * @category model
 * @since 2.0.0
 */
export class IORef {
    value;
    /**
     * @since 2.0.0
     */
    read;
    constructor(value) {
        this.value = value;
        this.read = () => this.value;
        this.write = this.write.bind(this);
        this.modify = this.modify.bind(this);
    }
    /**
     * @since 2.0.0
     */
    write(a) {
        return () => {
            this.value = a;
        };
    }
    /**
     * @since 2.0.0
     */
    modify(f) {
        return () => {
            this.value = f(this.value);
        };
    }
}
/**
 * @category constructors
 * @since 2.0.0
 */
export function newIORef(a) {
    return () => new IORef(a);
}
//# sourceMappingURL=IORef.js.map