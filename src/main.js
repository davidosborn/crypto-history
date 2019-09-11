'use strict'

import DatabaseConnectionFactory from '@davidosborn/api-framework/lib/database-connection-factory'
import getopt, {usage} from '@davidosborn/getopt'
import {Scheduler} from '@davidosborn/scheduler'
import fs from 'fs'
import process from 'process'
import BinanceSource from './binance-source'
import CoinmarketcapSource from './coinmarketcap-source'
import UpdateHistoryTask from './update-history-task'

export default async function main(args) {
	// Initialize the database.
	let db = new DatabaseConnectionFactory(process.env.npm_package_config_db, {
		logSql: process.env.npm_package_config_log_sql
	})

	// Parse the arguments.
	let opts = getopt(args, {
		options: [
			{
				short: 'd',
				long: 'dry',
				description: 'Perform a dry run.'
			},
			{
				short: 'h',
				long: 'help',
				description: 'Display this usage information and exit.',
				callback: usage
			},
			{
				short: 'i',
				long: 'interval',
				argument: 'time',
				description: 'The interval at which to perform each update.'
			},
			{
				short: 'v',
				long: 'verbose',
				description: 'Write extra information to the console.'
			}
		],
		usage: {
			program: 'crypto-history',
			spec: '[option]...'
		}
	})

	// Start the task scheduler.
	let scheduler = new Scheduler([
		new UpdateHistoryTask([
			new BinanceSource(db),
			new CoinmarketcapSource(db)
		], {
			dry: opts.options.dry
		})
	], {
		log: opts.options.verbose || process.env.npm_package_config_log_scheduler
	})
	await scheduler.start()
}
