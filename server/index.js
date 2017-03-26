'use strict'

const express = require('express')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const P = require('bluebird')
const graphqlHTTP = require('express-graphql')
const {buildSchema} = require('graphql')

const GRAPHQLSCHEMA = require('./conversation/query/conversation-graphql-schema')

const {
	fileRouter,
	folderRouter,
} = require('./file/file-router')

// Have mongoose use bluebird as it's promise library per: http://mongoosejs.com/docs/promises.html
mongoose.Promise = P

const webpackConfig = require('../webpack.config')

const app = express()
var server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// Parse JSON bodies
app.use(bodyParser.json())

// Set up the webpack dev server
app.use(webpackMiddleware(
	webpack(webpackConfig),
	{ publicPath: '/dist' }
))

// Set up static files
app.use(express.static('public'))


// Routes for primary API
app.use('/api/projects', require('./project/router'))
app.use('/api/files', fileRouter)
app.use('/api/folders', folderRouter)

mongoose
	.connect('mongodb://localhost:27019/backend-challenge')
	.then(() => {
		app.listen(8080, () => {
			console.log('Server started') // eslint-disable-line no-console
		})
	})
	.catch(e => {
		console.error('Could not connect to mongo', e) // eslint-disable-line no-console
		process.exit()
	})
