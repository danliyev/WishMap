import { EventEmitter } from 'node:events'

/**
 * An extended Map with Array-like methods and event emission.
 *
 * @template K - The type of keys in the map
 * @template V - The type of values in the map
 */
export class WishMap<K, V> extends Map<K, V> {
    /** Event emitter for map mutations */
    public readonly events: EventEmitter<WishMapEvents<K, V>> = new EventEmitter()

    public on = this.events.on
    public once = this.events.once
    public off = this.events.off

    /**
     * Removes the specified element from the map.
     *
     * @fires WishMap#delete
     */
    public override delete(key: K): boolean {
        const value = this.get(key)
        this.events.emit('delete', key, value)
        return super.delete(key)
    }

    /**
     * Adds or updates an element with a specified key and value.
     *
     * @fires WishMap#set
     */
    public override set(key: K, value: V): this {
        this.events.emit('set', key, value)
        return super.set(key, value)
    }

    /**
     * Returns the value at the given index. Supports negative indices.
     *
     * @param index - The index of the value to return
     */
    public at(index: number): V | undefined {
        const arr = Array.from(this.values())
        return arr.at(index)
    }

    /**
     * Merges this map with one or more other maps.
     *
     * @param maps - Maps to merge with this one
     * @returns A new WishMap containing all entries
     */
    public concat(...maps: Map<K, V>[]): WishMap<K, V> {
        const result = new WishMap<K, V>(this)
        for (const map of maps) {
            for (const [key, value] of map) {
                result.set(key, value)
            }
        }

        return result
    }

    /**
     * Copies a sequence of entries within the map.
     *
     * @param target - Index to copy entries to
     * @param start - Index to start copying from
     * @param end - Index to stop copying from (exclusive)
     */
    public copyWithin(target: number, start: number, end?: number): this {
        const entries = Array.from(this.entries())
        entries.copyWithin(target, start, end)

        this.clear()
        for (const [key, value] of entries) super.set(key, value)

        return this
    }

    /**
     * Tests whether all entries pass the provided function.
     *
     * @param fn - Function to test each entry
     */
    public every(fn: (value: V, key: K) => boolean): boolean {
        for (const [key, value] of this) {
            if (!fn(value, key)) return false
        }

        return true
    }

    /**
     * Fills entries with a value from start to end index.
     *
     * @param value - Value to fill with
     * @param start - Start index (default: 0)
     * @param end - End index (default: size)
     */
    public fill(value: V, start = 0, end = this.size): this {
        const keys = Array.from(this.keys())
        for (let i = start; i < end && i < keys.length; i++) {
            super.set(keys[i]!, value)
        }

        return this
    }

    /**
     * Creates a new WishMap with entries that pass the provided function.
     *
     * @param fn - Function to test each entry
     */
    public filter(fn: (value: V, key: K) => boolean): WishMap<K, V> {
        const result = new WishMap<K, V>()
        for (const [key, value] of this) {
            if (fn(value, key)) result.set(key, value)
        }

        return result
    }

    /**
     * Returns the first value that passes the provided function.
     *
     * @param fn - Function to test each entry
     */
    public find(fn: (value: V, key: K) => boolean): V | undefined {
        for (const [key, value] of this) {
            if (fn(value, key)) return value
        }
    }

    /**
     * Returns the index of the first entry that passes the provided function.
     *
     * @param fn - Function to test each entry
     * @returns Index of the first match, or -1 if not found
     */
    public findIndex(fn: (value: V, key: K) => boolean): number {
        let index = 0
        for (const [key, value] of this) {
            if (fn(value, key)) return index
            index++
        }

        return -1
    }

    /**
     * Returns the last value that passes the provided function.
     *
     * @param fn - Function to test each entry
     */
    public findLast(fn: (value: V, key: K) => boolean): V | undefined {
        const entries = Array.from(this.entries())
        for (let i = entries.length - 1; i >= 0; i--) {
            const [key, value] = entries[i]!
            if (fn(value, key)) return value
        }
    }

    /**
     * Returns the index of the last entry that passes the provided function.
     *
     * @param fn - Function to test each entry
     * @returns Index of the last match, or -1 if not found
     */
    public findLastIndex(fn: (value: V, key: K) => boolean): number {
        const entries = Array.from(this.entries())

        for (let i = entries.length - 1; i >= 0; i--) {
            const [key, value] = entries[i]!
            if (fn(value, key)) return i
        }

        return -1
    }

    /**
     * Flattens nested arrays in values to a specified depth.
     *
     * @param depth - Depth level to flatten (default: 1)
     */
    public flat<D extends number = 1>(depth?: D): unknown[] {
        return Array.from(this.values()).flat(depth)
    }

    /**
     * Maps each entry then flattens the result.
     *
     * @param fn - Function that returns a value or array of values
     */
    public flatMap<T>(fn: (value: V, key: K) => T | T[]): T[] {
        return Array.from(this.entries()).flatMap(([key, value]) => fn(value, key))
    }

    /** Alias for `has()`. Checks if a key exists in the map. */
    public includes = this.has

    /**
     * Returns the first index of a value.
     *
     * @param value - Value to search for
     * @param fromIndex - Index to start searching from (default: 0)
     */
    public indexOf(value: V, fromIndex = 0): number {
        const values = Array.from(this.values())
        return values.indexOf(value, fromIndex)
    }

    /**
     * Joins all values into a string.
     *
     * @param separator - Separator between values (default: ',')
     */
    public join(separator = ','): string {
        return Array.from(this.values()).join(separator)
    }

    /**
     * Returns the last index of a value.
     *
     * @param value - Value to search for
     * @param fromIndex - Index to start searching backwards from
     */
    public lastIndexOf(value: V, fromIndex = this.size - 1): number {
        const values = Array.from(this.values())
        return values.lastIndexOf(value, fromIndex)
    }

    /**
     * Creates an array by applying a function to each entry.
     *
     * @param fn - Function to apply to each entry
     */
    public map<T>(fn: (value: V, key: K) => T): T[] {
        return Array.from(this, ([key, value]) => fn(value, key))
    }

    /**
     * Removes and returns the last value.
     *
     * @returns The removed value, or undefined if empty
     */
    public pop(): V | undefined {
        const lastKey = Array.from(this.keys()).pop()
        if (lastKey === undefined) return undefined

        const value = this.get(lastKey)
        this.delete(lastKey)

        return value
    }

    /**
     * Adds entries to the end of the map.
     *
     * @param items - Entries as [key, value] tuples
     * @returns The new size of the map
     */
    public push(...items: [K, V][]): number {
        for (const [key, value] of items) this.set(key, value)
        return this.size
    }

    /**
     * Reduces entries to a single value, from left to right.
     *
     * @param fn - Reducer function
     * @param initial - Initial accumulator value
     */
    public reduce<T>(fn: (acc: T, value: V, key: K) => T, initial: T): T {
        let acc = initial
        for (const [key, value] of this) {
            acc = fn(acc, value, key)
        }

        return acc
    }

    /**
     * Reduces entries to a single value, from right to left.
     *
     * @param fn - Reducer function
     * @param initial - Initial accumulator value
     */
    public reduceRight<T>(fn: (acc: T, value: V, key: K) => T, initial: T): T {
        let acc = initial
        const entries = Array.from(this.entries())

        for (let i = entries.length - 1; i >= 0; i--) {
            const [key, value] = entries[i]!
            acc = fn(acc, value, key)
        }

        return acc
    }

    /** Reverses the order of entries in place. */
    public reverse(): this {
        const entries = Array.from(this.entries()).reverse()

        this.clear()
        for (const [key, value] of entries) super.set(key, value)

        return this
    }

    /**
     * Removes and returns the first value.
     *
     * @returns The removed value, or undefined if empty
     */
    public shift(): V | undefined {
        const firstKey = this.keys().next().value
        if (firstKey === undefined) return undefined

        const value = this.get(firstKey)
        this.delete(firstKey)

        return value
    }

    /**
     * Returns a new WishMap with a portion of entries.
     *
     * @param start - Start index (default: 0)
     * @param end - End index (default: size)
     */
    public slice(start = 0, end = this.size): WishMap<K, V> {
        const entries = Array.from(this.entries()).slice(start, end)
        return new WishMap<K, V>(entries)
    }

    /**
     * Tests whether any entry passes the provided function.
     *
     * @param fn - Function to test each entry
     */
    public some(fn: (value: V, key: K) => boolean): boolean {
        for (const [key, value] of this) {
            if (fn(value, key)) return true
        }

        return false
    }

    /**
     * Sorts entries in place.
     *
     * @param fn - Compare function for [key, value] tuples
     */
    public sort(fn?: (a: [K, V], b: [K, V]) => number): this {
        const entries = Array.from(this.entries()).sort(fn)

        this.clear()
        for (const [key, value] of entries) super.set(key, value)

        return this
    }

    /**
     * Removes and/or adds entries at a given index.
     *
     * @param start - Index to start changes
     * @param deleteCount - Number of entries to remove
     * @param items - Entries to add as [key, value] tuples
     * @returns A WishMap containing the removed entries
     */
    public splice(start: number, deleteCount?: number, ...items: [K, V][]): WishMap<K, V> {
        const entries = Array.from(this.entries())
        const removed = entries.splice(start, deleteCount ?? entries.length - start, ...items)

        this.clear()
        for (const [key, value] of entries) super.set(key, value)

        return new WishMap<K, V>(removed)
    }

    /** Returns a locale-specific string representation of values. */
    public toLocaleString(): string {
        return Array.from(this.values()).toLocaleString()
    }

    /** Returns a new WishMap with entries in reverse order. */
    public toReversed(): WishMap<K, V> {
        const entries = Array.from(this.entries()).reverse()
        return new WishMap<K, V>(entries)
    }

    /**
     * Returns a new sorted WishMap.
     * @param fn - Compare function for [key, value] tuples
     */
    public toSorted(fn?: (a: [K, V], b: [K, V]) => number): WishMap<K, V> {
        const entries = Array.from(this.entries()).sort(fn)
        return new WishMap<K, V>(entries)
    }

    /**
     * Returns a new WishMap with entries removed and/or added.
     *
     * @param start - Index to start changes
     * @param deleteCount - Number of entries to remove
     * @param items - Entries to add as [key, value] tuples
     */
    public toSpliced(start: number, deleteCount?: number, ...items: [K, V][]): WishMap<K, V> {
        const entries = Array.from(this.entries())
        entries.splice(start, deleteCount ?? entries.length - start, ...items)
        return new WishMap<K, V>(entries)
    }

    /** Returns a string representation of values. */
    public toString(): string {
        return Array.from(this.values()).toString()
    }

    /**
     * Adds entries to the beginning of the map.
     *
     * @param items - Entries as [key, value] tuples
     * @returns The new size of the map
     */
    public unshift(...items: [K, V][]): number {
        const entries = Array.from(this.entries())

        this.clear()
        for (const [key, value] of items) super.set(key, value)
        for (const [key, value] of entries) super.set(key, value)

        return this.size
    }

    /**
     * Returns a new WishMap with the value at the given index replaced.
     *
     * @param index - Index of the entry to replace
     * @param value - New value
     */
    public with(index: number, value: V): WishMap<K, V> {
        const entries = Array.from(this.entries())
        if (index < 0 || index >= entries.length) return new WishMap<K, V>(entries)

        entries[index] = [entries[index]![0], value]
        return new WishMap<K, V>(entries)
    }

    /** Returns the number of entries (alias for `size`). */
    public get length(): number {
        return this.size
    }
}

/** Events emitted by WishMap on mutations. */
export interface WishMapEvents<K, V> {
    /**
     * Emitted when an entry is deleted.
     */
    delete: [key: K, value: V | undefined]

    /**
     * Emitted when an entry is set.
     */
    set: [key: K, value: V]
}
