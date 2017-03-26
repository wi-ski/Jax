'use strict'

const model = require('../mongo/model')

module.exports = query => {
	return model
        .findOne(query)
        .lean()
        .exec()
}
