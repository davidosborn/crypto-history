'use strict'

import DatabaseConnectionFactory from '@davidosborn/api-framework/lib/database-connection-factory'
import Scheduler from '@davidosborn/scheduler/lib/scheduler'
import fs from 'fs'
import process from 'process'
import UpdateHistoryTask from './update-history-task'

export default async function main(args) {
	// Initialize the database.
	let db = new DatabaseConnectionFactory(process.env.npm_package_config_db, {
		logSql: process.env.npm_package_config_log_sql
	})

	// Start the task scheduler.
	let scheduler = new Scheduler([
		new UpdateHistoryTask(db)
	], {
		log: process.env.npm_package_config_log_scheduler
	})
	await scheduler.start()
}
