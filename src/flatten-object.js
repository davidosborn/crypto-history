'use strict'

/**
 * Flattens the nested properties of an object.
 * @param {Object} source      The object that will be flattened.
 * @param {String} [separator] A string that will be inserted between nested keys that are collapsed.
 * @param {String} [prefix]    A string that will be inserted before each key in the result.
 * @param {Object} [result]    An object that will store the flattened properties.
 * @returns {Object} The resulting object.
 */
export default function flattenObject(source, separator = '_', prefix = '', result = {}) {
	for (let [key, value] of Object.entries(source)) {
		if (typeof value === 'object')
			flattenObject(value, separator, prefix + key + separator, result)
		else
			result[prefix + key] = value
	}
	return result
}
