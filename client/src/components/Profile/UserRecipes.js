import React from "react";
import { Query, Mutation } from "react-apollo";
import {
  GET_USER_RECIPES,
  DELETE_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER
} from "../../queries";
import { Link } from "react-router-dom";
import Error from "../Error";
import Spinner from "../Spinner";

const handleDeleteRecipe = deleteRecipe => event => {
  const confirmDelete = window.confirm("Are u sure to delete this Recipe ?");
  if (confirmDelete) {
    deleteRecipe().then(({ data }) => {
      console.log("deleteRecipe", data);
    });
  }
};

const UserRecipes = ({
  session: {
    getCurrentUser: { username }
  }
}) => {
  return (
    <div>
      <h3>Your recipes</h3>
      <Query query={GET_USER_RECIPES} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <Error error={error} />;
          return (
            <ul>
              {!data.getUserRecipes.length && (
                <p>
                  <strong>You not have added recipes yet !</strong>
                </p>
              )}
              {data.getUserRecipes.map(({ _id, name, likes }) => (
                <li key={_id}>
                  <Link to={`/recipes/${_id}`}>{name}</Link>
                  <p style={{ marginBottom: 0 }}>Likes : {likes}</p>
                  <Mutation
                    mutation={DELETE_RECIPE}
                    variables={{ _id }}
                    update={(cache, { data: { deleteRecipe } }) => {
                      const { getUserRecipes } = cache.readQuery({
                        query: GET_USER_RECIPES,
                        variables: { username }
                      });
                      cache.writeQuery({
                        query: GET_USER_RECIPES,
                        variables: { username },
                        data: {
                          getUserRecipes: getUserRecipes.filter(recipe => {
                            return recipe._id !== deleteRecipe._id;
                          })
                        }
                      });
                    }}
                    refetchQueries={[
                      { query: GET_ALL_RECIPES },
                      { query: GET_CURRENT_USER }
                    ]}
                  >
                    {(deleteRecipe, { loading }) => {
                      return (
                        <p
                          className="delete-button"
                          onClick={handleDeleteRecipe(deleteRecipe)}
                        >
                          {loading ? "deleting..." : "X"}
                        </p>
                      );
                    }}
                  </Mutation>
                </li>
              ))}
            </ul>
          );
        }}
      </Query>
    </div>
  );
};

export default UserRecipes;
