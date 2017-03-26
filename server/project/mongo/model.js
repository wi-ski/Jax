'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose


const schema = new Schema({
	dateCreated: {
		type: Date,
		default: Date.now,
	},
	name: {
		required: true,
		type: String,
	},
	folders: {
		type: Schema.Types.ObjectId,
		ref: 'Fnode',
	},
})

module.exports = mongoose.model('Project', schema)
