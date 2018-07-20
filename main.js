'use strict'

import DatabaseConnectionFactory from 'davids-server-framework/database-connection-factory'
import Scheduler from 'davids-server-framework/scheduler'
import fs from 'fs'
import process from 'process'
import flattenObject from './flatten-object'
import setEnv from './set-env'
import UpdateHistoryTask from './update-history-task'

export default async function main(args) {
	// Load the package configuration into the environment.
	setEnv(flattenObject(require('./package.json').config))

	// Initialize the database.
	let db = new DatabaseConnectionFactory(process.env.db, {
		logSql: process.env.log_sql
	})

	// Start the task scheduler.
	let scheduler = new Scheduler([
		new UpdateHistoryTask(db)
	], {
		log: process.env.log_scheduler
	})
	await scheduler.start()
}
