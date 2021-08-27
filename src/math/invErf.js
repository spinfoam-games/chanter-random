/**
 * An approximation of the inverse error function, taken from
 * https://en.wikipedia.org/wiki/Error_function#Numerical_approximations
 * 
 * @param {number} x 
 * @returns {number} The approximate value of the inverse error function at x
 */
 const invErf = (x) => {
    const sign = Math.sign(x)
    const x2 = x * x

    const ln = Math.log(1 - x2)
    const a = 0.147
    const pia = Math.PI * a

    const alpha = (2 / pia) + (ln / 2)
    const beta = ln / a

    return sign * Math.sqrt(Math.sqrt(alpha * alpha - beta) - alpha)
}

module.exports = invErf