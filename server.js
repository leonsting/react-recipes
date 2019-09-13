const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "variables.env" });
const Recipe = require("./models/Recipe");
const User = require("./models/User");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

// Bring in GraphQL - Express middleware

const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

// Create schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Connect to Database
// console.log(process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch(err => {
    console.log(err);
  });

// Initial Express Server
const app = express();

//Enable CORS for server
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));

// Setup JWT authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers["authorization"];
  // console.log(token, typeof token);
  if (token !== "null") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      // console.log(currentUser);
      // Assign current user in to request
      req.currentUser = currentUser;
    } catch (error) {
      console.log(error);
    }
  }
  next();
});

// Create GraphQL application
// app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Connect schema with GraphQL
app.use(
  "/graphql",
  bodyParser.json(),
  // User options function to get (req, res, next) of route
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
      // Add assigned user above in to context
      currentUser,
      Recipe,
      User
    }
  }))
  // graphqlExpress({
  //   schema,
  //   // pass MongoDB model into context
  //   context: {
  //     Recipe,
  //     User
  //   }
  // })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
