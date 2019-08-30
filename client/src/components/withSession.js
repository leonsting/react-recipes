import React from "react";
import { Query } from "react-apollo";
import { GET_CURRENT_USER } from "../queries";

const withSession = Component => props => {
  return (
    <Query query={GET_CURRENT_USER}>
      {({ data, loading, refetch }) => {
        if (loading) {
          return <div className="App">Loading...</div>;
        }
        console.log("withSession", data);
        // Using refetch to call query execute again
        return <Component {...props} refetch={refetch} />;
      }}
    </Query>
  );
};

export default withSession;
