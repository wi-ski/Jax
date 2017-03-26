'use strict'

const fileRouter = require('express').Router()  // eslint-disable-line new-cap
const folderRouter = require('express').Router()  // eslint-disable-line new-cap
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = require('../lib/s3')

const uploader = multer({
	storage: multerS3({
		s3,
		bucket: 'coding-challenges',
		key: (req, file, cb) => {
			const projectId = req.query.projectId
			return cb(null, `/projects/${projectId}/${Date.now()}/${file.originalname}`)
		},
	}),
})

// This should upload the file, however, you'll still need to add another function after this
// uploader middleware to actually save a record of this file in Mongo

fileRouter.post('/', uploader.single('file'), require('./handler/set-project-file-assoc.js'))
fileRouter.get('/', require('./handler/find-by-project-id.js'))
fileRouter.get('/download-all', require('./handler/download-all.js'))
fileRouter.get('/:fileId/content', require('./handler/download.js'))

folderRouter.post('/', require('./handler/create-folder.js'))
folderRouter.get('/:parentId/items', require('./handler/get-folder-contents.js'))

module.exports = { fileRouter, folderRouter }
