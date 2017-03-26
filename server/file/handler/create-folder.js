'use strict'
const model = require('../mongo/model')
const createOne = require('../command/create-one.js')
module.exports = (req, res, next)=>{
	const { name } = req.body
	const { projectId, parentId } = req.query
	createOne({
		type: 'FOLDER',
		name: name,
		projectId,
		parentId,
	})
.then(newFileBlob => {
	res.json(newFileBlob)
})
.catch(next)
}
