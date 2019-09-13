import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import Navbar from "./components/Navbar";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import Search from "./components/Recipe/Search";
import AddRecipe from "./components/Recipe/AddRecipe";
import RecipePage from "./components/Recipe/RecipePage";
import Profile from "./components/Profile/Profile";
import withSession from "./components/withSession";
import withAuth from "./components/withAuth";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  // uri: "http://localhost:4444/graphql",// Local
  uri: "https://react-recipe-dan.herokuapp.com/graphql", // Heroku
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: { authorization: token }
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.log("networkError", networkError);
      if (networkError.statusCode === 401) {
        localStorage.removeItem("token");
      }
    }
  }
});

const conditionFun = session => {
  return session && session.getCurrentUser;
};

const Root = ({ refetch, session }) => (
  <BrowserRouter>
    <>
      <Navbar session={session} />
      <Switch>
        <Route path="/" component={App} exact />
        <Route path="/search" component={Search} exact />
        <Route
          path="/recipe/add"
          // render={() => <AddRecipe session={session} />}
          component={withAuth(conditionFun, session)(AddRecipe)}
          exact
        />
        <Route path="/recipes/:_id" component={RecipePage} />
        <Route
          path="/profile"
          // render={() => <Profile session={session} />}
          component={withAuth(conditionFun, session)(Profile)}
          exact
        />
        {/* Using render prop instead of component prop to assign props for component */}
        <Route
          path="/signin"
          render={() => <Signin refetch={refetch} />}
          exact
        />
        <Route
          path="/signup"
          render={() => <Signup refetch={refetch} />}
          exact
        />
        <Redirect to="/" />
      </Switch>
    </>
  </BrowserRouter>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById("root")
);
