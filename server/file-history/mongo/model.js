'usestrict'

const mongoose = require('mongoose')
const { Schema } = mongoose
const schema = new mongoose.Schema({
	dateCreated: {
		type: Date,
		default: Date.now,
	},
	transactionType: { // Download/upload
		required: true,
		type: String,
	},
	fNodeId: {
		type: Schema.Types.ObjectId,
		ref: 'Fnode',
	},
})

module.exports = mongoose.model('FNodeHistory', schema)
