import React from "react";
import { Redirect } from "react-router-dom";
const withAuth = (conditionFun, session) => Component => props => {
  return conditionFun(session) ? (
    <Component session={session} {...props} />
  ) : (
    <Redirect to="/" />
  );
};

export default withAuth;
