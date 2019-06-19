'use strict'

// TODO: This is under development and is not used yet.

import binance from 'binance-api-node'
import Exchange from './exchange'

export default class Binance extends Exchange {
	constructor() {
		super('Binance')

		this._client = binance()
	}

	async getAssets() {
		console.log(await this._client.dailyStats())
		return new Map((await this._client.dailyStats())
			.filter(function(datum) {
				return /^[A-Z]+$/.test(datum.symbol)
			})
			.map(function(datum) {
				return [
					datum.symbol, {
						price: Number.parseFloat(datum.lastPrice),
						volume: Number.parseFloat(datum.volume)
					}
				]
			}))
	}
}
