'use strict'

export default function flattenObject(source, separator = '_', prefix = '', result = {}) {
	result = {}
	for (let [key, value] of Object.entries(source)) {
		if (typeof value === 'object')
			flattenObject(value, separator, prefix + key + separator, result)
		else
			result[prefix + key] = value
	}
	return result
}
