'use strict'
const model = require('../mongo/model')
const Archiver = require('archiver')
const find = require('../command/find.js')
const { curry } = require('ramda')
const s3 = require('../../lib/s3')
const findProject = require('../../project/command/find-one.js')


const appendToArchive = curry((archive, stream, fileName)=>{
	archive.append(stream, { name: fileName })
})
const newArchive = () => Archiver('zip', {
	zlib: { level: 9 }, // Sets the compression level.
})

module.exports = (req, res, next)=>{

	const { projectId } = req.query


	findProject({
		_id: projectId,
	})
	.then(project => {
		return find({
			projectId: project._id,
			type: 'FILE',
		})
		.then(fileList => {
			const archive            = newArchive()
			const appendToCurArchive = appendToArchive(archive)
			archive.pipe(res)
			archive.on('error', (e)=>{throw e})
			archive.on('end', function archiveEnd() {})

			fileList.forEach(fileObj => {
				const options = {
					Bucket: 'coding-challenges',
					Key: fileObj.meta.key,
				}
				const readStream = s3.getObject(options).createReadStream()
				readStream.on('error', e=>{throw e})
				appendToCurArchive(
					readStream,
					fileObj.name
				)
			})

			res.attachment(`${project.name}_project.zip`)
			res.setHeader('Content-Type', 'application/octet-stream')
			res.on('close', () => {
				return res.status(200).send('OK').end()
			})
			archive.finalize()
		})
	})
	.catch(next)
}

