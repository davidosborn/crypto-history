'use strict'

import Task from '@davidosborn/scheduler/lib/task'
import buildSqlInsertQuery from '@davidosborn/sql-utilities/lib/build-sql-insert-query'
import fetch from 'node-fetch'
import process from 'process'

/**
 * A task to update the history.
 */
export default class UpdateHistoryTask extends Task {
	/**
	 * A column in the market data.
	 * @typedef UpdateHistoryTask~MarketDataColumn
	 * @type {Array}
	 * @property {String} 0 The name.
	 * @property {String} 1 The data type.
	 */
	/**
	 * The columns in the market data.
	 * @type {Array.<UpdateHistoryTask~MarketDataColumn>}
	 */
	static columns = [
		['id', 'string'],
		['name', 'string'],
		['symbol', 'string'],
		['rank', 'number'],
		['price_btc', 'number'],
		['price_cad', 'number'],
		['price_usd', 'number'],
		['24h_volume_cad', 'number'],
		['24h_volume_usd', 'number'],
		['market_cap_cad', 'number'],
		['market_cap_usd', 'number'],
		['available_supply', 'number'],
		['total_supply', 'number'],
		['max_supply', 'number'],
		['percent_change_1h', 'number'],
		['percent_change_24h', 'number'],
		['percent_change_7d', 'number'],
		['last_updated', 'date']
	]

	/**
	 * The names of the columns in the market data that are required.
	 */
	static requiredColumns = ['symbol', 'last_updated']

	/**
	 * Creates a new instance.
	 * @param {Object} db The database.
	 */
	constructor(db) {
		super({
			interval: process.env.npm_package_config_update_history_task_interval,
			name: 'update history'
		})

		this._db = db
	}

	/**
	 * Performs the task.
	 * @param {Number} now The current time.
	 * @param {Number} time The scheduled time.
	 */
	async perform(now, time) {
		let response = await (await fetch('https://api.coinmarketcap.com/v1/ticker/?convert=CAD&limit=0')).json()

		let columns = this.constructor.columns
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

		let query = buildSqlInsertQuery('coinmarketcap', columns, rows, {ignoreDuplicateKeys: true})
		await this._db.query(this._db.constructor.ROLE_APP, query)
	}
}
