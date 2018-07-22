'use strict'

import process from 'process'

export default function setEnv(config) {
	for (let [key, value] of Object.entries(config))
		if (!process.env.hasOwnProperty(key))
			process.env[key] = value
}
