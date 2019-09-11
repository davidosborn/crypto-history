'use strict'

/**
 * A source of market data.
 */
export default class Source {
	/**
	 * The data from the source.
	 * @typedef {Object} Source~Data
	 * @property {Array.<String>} columns The column names.
	 * @property {Array.<Array>} rows The rows of column values.
	 */

	/**
	 * Creates a new instance.
	 * @param {Object} [options={}] The options.
	 * @param {Object} [options.name] The name of this source.
	 * @param {Boolean} [options.dry=false] A value indicating whether to perform a dry run.
	 */
	constructor(options = {}) {
		/**
		 * The name of this source.
		 * @type {String}
		 */
		this.name = options.name || this.constructor.name

		/**
		 * A value indicating whether to perform a dry run.
		 * @type {Boolean}
		 * @private
		 */
		this._dry = Boolean(options.dry)
	}

	/**
	 * Updates the database with fresh data from this source.
	 * @param {Object} [options={}] The options.
	 * @param {Boolean} [options.dry=false] A value indicating whether to perform a dry run.
	 */
	async update() {
		let data = await this.load()
		let query = buildSqlInsertQuery('coinmarketcap', data.columns, data.rows, {ignoreDuplicateKeys: true})
		if (!this._dry)
			await this._db.query(this._db.constructor.ROLE_APP, query)
	}

	/**
	 * Loads the data from this source.
	 * @returns {Source~Data}
	 */
	async load() {
		throw new Error('This method must be implemented.')
	}
}
