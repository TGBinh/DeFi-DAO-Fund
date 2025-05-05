export interface Marshal<T, S> {
    fromJSON(value: unknown): T
    toJSON(value: T): S
}

export const bigintTransformer = {
    from: (value: string | null) => {
        return value === null ? null : BigInt(value)
    },
    to: (value: bigint | null) => {
        return value?.toString() || null
    }
}