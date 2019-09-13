import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import Error from "../Error";
import { GET_RECIPE } from "../../queries";
import LikeRecipe from "./LikeRecipe";
import Spinner from "../Spinner";

const RecipePage = ({ match }) => {
  const { _id } = match.params;
  console.log("_id :: ", _id);
  return (
    <Query query={GET_RECIPE} variables={{ _id }}>
      {({ data, error, loading }) => {
        if (loading) {
          return <Spinner />;
        }
        if (error) {
          return <Error error={error} />;
        }
        const {
          username,
          name,
          imageUrl,
          category,
          instructions,
          description,
          likes
        } = data.getRecipe;
        console.log("RecipePage", data.getRecipe);
        return (
          <div className="App">
            <div
              style={{
                background: `url(${imageUrl}) center center / cover no-repeat`
              }}
              className="recipe-image"
            ></div>
            <div className="recipe">
              <div className="recipe-header">
                <h2 className="recipe-name">
                  <strong>{name}</strong>
                </h2>
                <h5>
                  <strong>{category}</strong>
                  <p>
                    Created by <strong>{username}</strong>
                  </p>
                  <p>
                    {likes}{" "}
                    <span role="img" aria-label="heart">
                      ❤️
                    </span>
                  </p>
                </h5>
              </div>
              <blockquote className="recipe-description">
                {description}
              </blockquote>
              <h3 className="recipe-instructions__title">Instructions</h3>
              <div
                className="recipe-instructions"
                dangerouslySetInnerHTML={{ __html: instructions }}
              ></div>
              <LikeRecipe _id={_id} />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(RecipePage);
