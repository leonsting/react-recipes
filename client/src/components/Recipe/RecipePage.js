import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import Error from "../Error";
import { GET_RECIPE } from "../../queries";
import LikeRecipe from "./LikeRecipe";

const RecipePage = ({ match }) => {
  const { _id } = match.params;
  console.log("_id :: ", _id);
  return (
    <Query query={GET_RECIPE} variables={{ _id }}>
      {({ data, error, loading }) => {
        if (loading) {
          return <div>Loading ...</div>;
        }
        if (error) {
          return <Error error={error} />;
        }
        const {
          username,
          name,
          category,
          instructions,
          description,
          likes
        } = data.getRecipe;
        console.log("RecipePage", data.getRecipe);
        return (
          <div className="App">
            <h4>{name}</h4>
            <p>Category : {category}</p>
            <p>Instructions : {instructions}</p>
            <p>Description: {description}</p>
            <p>Likes : {likes}</p>
            <p>Create by : {username}</p>
            <LikeRecipe _id={_id} />
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(RecipePage);
