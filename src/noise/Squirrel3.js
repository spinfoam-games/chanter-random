const maxValue = (1 << 31) * -1

/**
 * An implementation of the noise algorithm suggested by Squirrel Eiserloh
 * in his GDC talk here: https://www.youtube.com/watch?v=LWFzPP8ZbdU
 * 
 * @constructor
 * @param {number} [seed=Date.now()] The seed value for the noise sequence
 * @param {number} [offset=0] A starting offset for the noise
 */
function Squirrel3(seed, offset) {
    this.seed = seed || Date.now()
    this.offset = offset || 0
}

/**
 * Changes the seed value for the noise generator.
 * (This does not automatically reset the offset value.)
 * 
 * @param {number} seed The new seed value
 */
Squirrel3.prototype.setSeed = function(seed) {
    this.seed = seed
}

/**
 * Moves the current offset into the noise sequence.
 * 
 * The same offset combined with the same seed will always
 * return the same value.
 * 
 * @param {number} offset The new position to move to in the noise sequence
 */
Squirrel3.prototype.seekTo = function(offset) {
    this.offset = offset
}

/**
 * Returns a floating point number >= 0 and < 1, then advances
 * the internal position offset by 1.
 * 
 * @returns Number
 */
Squirrel3.prototype.float = function() {
    let value = this.offset

    value *= 0xB5297A4D
    value += this.seed
    value ^= value >>> 8
    value += 0x68E31DA4
    value ^= value << 8
    value *= 0x1B56C4E9
    value ^= value >>> 8

    this.offset++

    return ((value / maxValue) + 1) / 2
}

module.exports = Squirrel3