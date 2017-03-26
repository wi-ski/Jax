'use strict'
const findOne = require('../command/find-one.js')
const { curry } = require('ramda')
const s3 = require('../../lib/s3')
const getSignedUrl = require('../../lib/get-signed-s3-download-url.js')


module.exports = (req, res, next)=>{
	const { projectId } = req.query
	const { fileId } = req.params
	findOne({
		projectId,
		_id: fileId,
	})
	.then(file=>{
		const signedUrl = getSignedUrl(file.meta.key)
		res.redirect(signedUrl)
	})
	.catch(next)
}

