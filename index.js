'use strict'

require('@babel/register')({ ignore: [] })
require('./main').default(require('process').argv.slice(2))
