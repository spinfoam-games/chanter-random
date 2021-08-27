const invErf = require("./math/invErf")
const Squirrel3 = require("./noise/Squirrel3")

/**
 * Creates a new RandomSource with the given noise provided.
 * 
 * If no noise generator is provided an instance of the
 * Squirrel3 generator will be created and used.
 * 
 * @constructor
 * @param {Object} basis A noise generator
 */
function RandomSource(basis) {
    this.basis = basis || new Squirrel3()
    this.positionStack = []
}

/**
 * Changes the seed of the underlying noise generator to
 * the given value and resets the position of the generator
 * to 0.
 * 
 * @param {number} seed A numeric value to seed the underlying noise generator with
 */
RandomSource.prototype.reseed = function(seed) {
    this.basis.setSeed(seed)
    this.basis.seekTo(0)
}

/**
 * Pushes the current position in the noise generator onto an
 * internal stack and then sets the generator's position to
 * the given value.
 * 
 * The previous position may later be restored with the
 * `return` function.
 * 
 * @param {number} position The offset in the noise generator to move to
 */
RandomSource.prototype.seekTo = function(position) {
    this.positionStack.push(this.basis.offset)
    this.basis.seekTo(position)
}

/**
 * Pops the last saved generator position off the internal stack
 * and sets the generator to that position.
 * 
 * Does nothing if the stack is empty.
 */
RandomSource.prototype.return = function() {
    if (this.positionStack.length < 1) return

    this.basis.seekTo(this.positionStack.pop())
}

/**
 * @returns {number} A random float in the range 0 to 1 (exclusive)
 */
RandomSource.prototype.float = function() {
    return this.basis.float()
}

/**
 * Returns true or false with the given odds.
 * 
 * @param {number} [odds=0.5] The odds of returning true as a float from 0 to 1; defaults to 0.5
 * @returns {boolean} A boolean true or false
 */
RandomSource.prototype.bool = function(odds = 0.5) {
    return (this.basis.float() < odds)
}

/**
 * @param {number} [mean=0.5] The mean (center) of the distribution
 * @param {number} [deviation=1.0] The deviation of the distribution
 * @returns {number} A sample from an approximation of the normal distribution with the given mean and deviation
 */
RandomSource.prototype.normal = function(mean = 0.5, deviation = 1.0) {
    const x = this.float()
    return mean + deviation * Math.SQRT2 * invErf((x * 2) - 1)
}

/**
 * Returns a random integer. By default the range is from 0 to Number.MAX_SAFE_INTEGER-1.
 * If a single parameter (`alpha`) is provided the range is 0 to `alpha`-1.
 * If two parameters are provided the range is `alpha` to `beta`-1.
 * 
 * @param {number} [alpha] The maximum value if beta is not specified, the minimum if it is
 * @param {number} [beta] The maximum value
 * @returns {number} A random value in the specified range.
 */
RandomSource.prototype.integer = function(alpha, beta) {
    let min = 0
    let max = Number.MAX_SAFE_INTEGER

    if (alpha != undefined) {
        min = (beta != undefined) ? alpha : 0
        max = (beta != undefined) ? beta : alpha
    }

    return Math.floor(this.float() * (max - min) + min)
}

/**
 * Returns a random index in the range 0 to `ar`.length-1.
 * 
 * @param {Array|string} ar An array of anything, or a string
 * @returns {number} A random index within `ar`
 */
RandomSource.prototype.arrayIndex = function(ar) {
    return this.integer(ar.length)
}

/**
 * Selects a random item from the given array and returns it.
 * 
 * @param {Array|string} ar An array of anything, or a string
 * @returns {*} A randomly selected item from `ar`
 */
RandomSource.prototype.arrayItem = function(ar) {
    return ar[this.arrayIndex(ar)]
}

module.exports = RandomSource