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
	 * Creates a new instance.
	 * @param {Array.<Source>} sources The sources.
	 */
	constructor(sources) {
		super({
			interval: process.env.npm_package_config_update_history_task_interval,
			name: 'update history'
		})

		this._sources = sources
	}

	/**
	 * Performs the task.
	 * @param {Number} now The current time.
	 * @param {Number} time The scheduled time.
	 */
	async perform(now, time) {
		await Promise.all(sources
			.map(function(source) {
				return source.update()
			})
		)
	}
}
