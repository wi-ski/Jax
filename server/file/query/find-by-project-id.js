'use strict'

const model = require('../mongo/model')

module.exports = projectId => {
	return model
.find({ projectId })
.lean()
.exec()
}
