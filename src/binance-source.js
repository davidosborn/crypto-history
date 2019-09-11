'use strict'

import binance from 'binance-api-node'
import Source from './source'

/**
 * A source of market data from Binance.
 */
export default class BinanceSource extends Source {
	/**
	 * A column in the market data.
	 * @typedef {Array} BinanceSource~MarketDataColumn
	 * @property {String} 0 The name.
	 * @property {String} 1 The data type.
	 */

	/**
	 * The columns in the market data.
	 * @type {Array.<BinanceSource~MarketDataColumn>}
	 */
	static columns = [
		['id',                 'string'],
		['name',               'string'],
		['symbol',             'string'],
		['rank',               'number'],
		['price_btc',          'number'],
		['price_cad',          'number'],
		['price_usd',          'number'],
		['24h_volume_cad',     'number'],
		['24h_volume_usd',     'number'],
		['market_cap_cad',     'number'],
		['market_cap_usd',     'number'],
		['available_supply',   'number'],
		['total_supply',       'number'],
		['max_supply',         'number'],
		['percent_change_1h',  'number'],
		['percent_change_24h', 'number'],
		['percent_change_7d',  'number'],
		['last_updated',       'date']
	]

	/**
	 * The names of the columns in the market data that are required.
	 */
	static requiredColumns = [
		'symbol',
		'last_updated'
	]

	/**
	 * Creates a new instance.
	 * @param {Object} db The database.
	 */
	constructor(db) {
		super({
			name: 'CoinMarketCap source'
		})

		this._db = db
		this._binance = binance()
	}

	/**
	 * Loads the data from this source.
	 * @returns {Source~Data}
	 */
	async load() {
		let response = (await this._binance.dailyStats())
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
			})

		console.log(response)

		/*let columns = this.constructor.columns
		let requiredColumns = this.constructor.requiredColumns

		let rows = Array.from(response)
			.filter(function(row) {
				return requiredColumns
					.every(function(column) {
						return row[column] != null
					})
			})
			.map(function(row) {
				return columns
					.map(function(column) {
						let value = row[column[0]]
						if (value != null)
							switch (column[1]) {
								case 'date':
									value = new Date(value * 1000)
									break
								case 'number':
									value = +value
									break
								case 'string':
									value = '' + value
									break
							}
						return value
					})
			})

		columns = columns
			.map(function(column) {
				return column[0]
			})

		return {
			columns,
			rows
		}*/
	}
}
