require('dotenv').config();

const { ApolloServer } = require('apollo-server-lambda');
const typeDefs = require('../graphql/typeDefs');
const resolvers = require('../graphql/resolvers');
const mongoose = require('mongoose');

console.log(process.env.NODE_ENV)
let conn = null
const getHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false

    if (!conn) {
        conn = await mongoose
            .connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });

        console.log("Mongodb connected!")
    }

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        debug: true,
        context: () => ({ ...context, req: event }),
    });
    const graphqlHandler = server.createHandler({
        expressGetMiddlewareOptions: {
            cors: {
                origin: '*',
                methods: ["POST"],
                allowedHeaders: "*",
                credentials: true
            }
        }
    });
    if (!event.requestContext) {
        event.requestContext = context;
    }
    return graphqlHandler(event, context);
}

exports.handler = getHandler;
