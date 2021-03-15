require('dotenv').config();

const { ApolloServer, PubSub } = require('apollo-server');

const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');

const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const PORT = process.env.PORT || 4000;

var env = process.env.NODE_ENV || 'development';

const server = new ApolloServer({
  cors: {
    origin: env=="development"? ['http://localhost:3000'] : ['https://attendlytical.netlify.app'],
    credentials: true
  },
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });

/*Test

  Postman
{
  "query": "mutation {createCourse(courseInput: {code: \"123\", section: \"123\", name: \"123\"}) {name}}"
}

  mutation{
  createPerson(personInput:{
    firstName: "chai"
    lastName: "cheah Wen"
    email:"12wss3"
    password: "123"
    userLevel: 0
    SchoolCardID: "A17CS0028"
  }){
    _id
    lastLogin
    createdAt
  }
}

  mutation{
  createCourse(courseInput:{
    name: "Test",
    code:"test",
    section: "test"
  })
  {
    creator{
      firstName

    }
    code
    name
  }
}

  mutation{
  deleteCourse(courseID:"5ee1de0f270b0f8774f94094")
 {
  name
  creator{
    firstName
    createdCourses{
      name
    }
  }
}
}




  */
