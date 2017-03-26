'use strict'
const model = require('../mongo/model')
const find = require('../command/find.js')
module.exports = (req, res, next)=>{
	const { parentId } = req.params
	const { projectId } = req.query
	find({
		projectId,
		parentId,
	})
	.then(newFileBlob => {
		res.json(newFileBlob)
	})
	.catch(next)
}

