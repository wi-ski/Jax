'use strict'
const model = require('../mongo/model')
const createOne = require('../command/create-one.js')
const findOne = require('../command/find-one')
module.exports = (req, res, next)=>{
	const { file } = req
	const { projectId, parentId } = req.query
	let pending

	if (parentId) {                            // Ghetto
		pending = findOne({
			_id: parentId,
		})
		.then(parent => {
			return parent.update({
				size: parent.size + file.size,
			})
		})
	} else {
		pending = Promise.resolve(null)
	}                                          // Ghetto


	pending.then(parent => {
		return createOne({
			type: 'FILE',
			meta: file,
			name: file.originalname,
			size: file.size,
			projectId,
			parentId,
		})
		.then(newFileBlob => {
			res.json(newFileBlob)
		})

	})
	.catch(next)
}

