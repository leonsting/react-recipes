import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import withSession from "./components/withSession";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "http://localhost:4444/graphql",
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

const Root = ({ refetch }) => (
  <BrowserRouter>
    <Switch>
      <Route path="/" component={App} exact />
      {/* Using render prop instead of component prop to assign props for component */}
      <Route path="/signin" render={() => <Signin refetch={refetch} />} exact />
      <Route path="/signup" render={() => <Signup refetch={refetch} />} exact />
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById("root")
);
