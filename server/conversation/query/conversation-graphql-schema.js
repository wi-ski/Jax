const {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
  GraphQLSchema
} = require ('graphql');

// Here is some dummy data to make this piece of code simpler.
// It will be changeable after introducing mutation.
var TODOs = [
  {
    "id": 1446412739542,
    "title": "Read emails",
    "completed": false
  },
  {
    "id": 1446412740883,
    "title": "Buy orange",
    "completed": true
  }
];

var TodoType = new GraphQLObjectType({
  name: 'todo',
  fields: function () {
    return {
      id: {
        type: GraphQLInt
      },
      title: {
        type: GraphQLString
      },
      completed: {
        type: GraphQLBoolean
      }
    }
  }
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function () {
    return {
      todos: {
        type: new GraphQLList(TodoType),
        resolve: function () {
          return TODOs;
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: queryType
});