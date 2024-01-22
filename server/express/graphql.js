require("dotenv").config();

const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const { PubSub, makeExecutableSchema } = require("apollo-server");

const mongoose = require("mongoose");

const typeDefs = require("../graphql/typeDefs");

const resolvers = require("../graphql/resolvers");

const pubsub = new PubSub();

const cors = require(`cors`);

var env = process.env.NODE_ENV || "development";

const app = express();

app.use(
  cors({
    origin:
      env == "development"
        ? ["http://localhost:3000"]
        : ["https://attendlytical.netlify.app"],
    credentials: true,
  })
);

app.use(
  "/graphql",
  graphqlHTTP((req, res, graphQLParams) => ({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    context: {
      req,
      pubsub,
    },
    graphiql: true,
  }))
);

mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected");

    return app.listen(8080);
  })
  .then((res) => {
    console.log(`Server running at port: 8080`);
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = app;
