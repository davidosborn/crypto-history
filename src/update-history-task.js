'use strict'

import Task from '@davidosborn/scheduler/task'
import buildSqlInsertQuery from '@davidosborn/sql-utilities/build-sql-insert-query'
import fetch from 'node-fetch'

/**
 * A task to update the history.
 */
export default class UpdateHistoryTask extends Task {
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
	 * Creates a new instance.
	 * @param {Object} db The database.
	 */
	constructor(db) {
		super({
			interval: 36000,//00,
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
		response = Array.from(response)
			.filter(function(row) {
				return (
					row['symbol'] != null &&
					row['last_updated'] != null
				)
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
		let query = buildSqlInsertQuery('coinmarketcap', columns, response, { ignoreDuplicateKeys: true })
		this._db.query(this._db.constructor.ROLE_APP, query)
	}
}
