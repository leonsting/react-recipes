import React from "react";
import { ApolloConsumer } from "react-apollo";
import { withRouter } from "react-router-dom";

const handleSignout = (client, history) => () => {
  localStorage.removeItem("token");
  client.resetStore();
  history.push("/");
};

const Signout = ({ history }) => {
  return (
    <ApolloConsumer>
      {client => (
        <button onClick={handleSignout(client, history)}>Signout</button>
      )}
    </ApolloConsumer>
  );
};

export default withRouter(Signout);
