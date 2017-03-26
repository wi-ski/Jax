'use strict'

const express = require('express')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const P = require('bluebird')
const graphqlHTTP = require('express-graphql')
const {buildSchema} = require('graphql')

const {
	fileRouter,
	folderRouter,
} = require('./file/file-router')

// Have mongoose use bluebird as it's promise library per: http://mongoosejs.com/docs/promises.html
mongoose.Promise = P

const webpackConfig = require('../webpack.config')

const app = express()

// Parse JSON bodies
app.use(bodyParser.json())

// Set up the webpack dev server
app.use(webpackMiddleware(
	webpack(webpackConfig),
	{ publicPath: '/dist' }
))

// Set up static files
app.use(express.static('public'))

var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
};
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));




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
