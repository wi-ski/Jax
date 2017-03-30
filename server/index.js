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


const configurateSockets = require('./conversation/sockets')

const {
	fileRouter,
	folderRouter,
} = require('./file/file-router')

// Have mongoose use bluebird as it's promise library per: http://mongoosejs.com/docs/promises.html
mongoose.Promise = P

const webpackConfig = require('../webpack.config')

const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(8809)
// io.sockets.on('connection', function (socket) {
// 	socket.join('room')
// 	// console.log(io.sockets.clients('room'));
// 	// console.log(io.of('/').in('room').clients());
// 	console.log(socket.adapter.rooms)
// });




var NRP    = require('node-redis-pubsub');
var config = {
  port  : 6379  , // Port of your locally running Redis server
  scope : 'demo'  // Use a scope to prevent two NRPs from sharing messages
};

var nrp = new NRP(config); // This is the NRP client
// Parse JSON bodies
app.use(bodyParser.json())

// Set up the webpack dev server
app.use(webpackMiddleware(
	webpack(webpackConfig),
	{ publicPath: '/dist' }
))

// Routes for primary API
app.use('/api/projects', require('./project/router'))
app.use('/api/files', fileRouter)
app.use('/api/folders', folderRouter)

app.get('/',function(req, res) {
  res.sendFile("/Users/wiski/Projects/ChatApp/application/public/index.html") //<- What the actual fuck is going on here.
  // res.sendFile(__dirname+'/public')
})

mongoose
	.connect('mongodb://localhost:27019/backend-challenge')
	.then(() => {
configurateSockets(io,mongoose,nrp)

		app.listen(8808, () => {
			console.log('Server started') // eslint-disable-line no-console
		})
	})
	.catch(e => {
		console.error('Could not connect to mongo', e) // eslint-disable-line no-console
		process.exit()
	})
