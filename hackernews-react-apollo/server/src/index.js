const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Subscription = require('./resolvers/Subscription')
const Feed = require('./resolvers/Feed')

const resolvers = {
  Query,
  Mutation,
  Subscription,
  Feed,
}

const server = new GraphQLServer({
  // type definitions from your app schema imported from src/schema.graphql
  typeDefs: './src/schema.graphql',
  // This is a JavaScript object that mirrors the Query, Mutation and Subscription
  // types and their fields from your app schema. Each field in the app schema
  // is represented by a function with the same name in that object.
  resolvers,
  // This is an object that get’s passed through the resolver chain and every
  // resolvers can read from or write to.
  context: req => ({
    ...req,
    // the db field contains an instance of Prisma from the prisma-binding package.
    // This instance will allow your resolvers to simply delegate the execution of
    // an incoming request to an appropriate resolver from the Prisma API.
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/public-satinlizard-489/hackernews-graphql-js/dev', // yarn prisma info
      secret: 'mysecret123',
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
