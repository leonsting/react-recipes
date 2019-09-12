import { gql } from "apollo-boost";
import { recipeFragments } from "./fragments";
//#region Recipes queries
export const GET_ALL_RECIPES = gql`
  query {
    getAllRecipes {
      _id
      name
      category
    }
  }
`;

export const GET_RECIPE = gql`
  query($_id: ID!) {
    getRecipe(_id: $_id) {
      ...CompleteRecipe
    }
  }
  ${recipeFragments.recipe}
`;

export const SEARCH_RECIPES = gql`
  query($searchTerm: String!) {
    search(searchTerm: $searchTerm) {
      _id
      name
      likes
    }
  }
`;

export const GET_USER_RECIPES = gql`
  query($username: String!) {
    getUserRecipes(username: $username) {
      _id
      name
      likes
    }
  }
`;

//#endregion

//#region Recipes mutations
export const ADD_RECIPE = gql`
  mutation(
    $name: String!
    $category: String!
    $description: String!
    $instructions: String!
    $username: String!
  ) {
    addRecipe(
      name: $name
      category: $category
      description: $description
      instructions: $instructions
      username: $username
    ) {
      ...CompleteRecipe
    }
  }
  ${recipeFragments.recipe}
`;

export const DELETE_RECIPE = gql`
  mutation($_id: ID) {
    deleteRecipe(_id: $_id) {
      _id
      name
    }
  }
`;

export const LIKE_RECIPE = gql`
  mutation($_id: ID!, $username: String!) {
    likeRecipe(_id: $_id, username: $username) {
      ...LikeRecipe
    }
  }
  ${recipeFragments.like}
`;

export const UNLIKE_RECIPE = gql`
  mutation($_id: ID!, $username: String!) {
    unlikeRecipe(_id: $_id, username: $username) {
      ...LikeRecipe
    }
  }
  ${recipeFragments.like}
`;

//#endregion

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      username
      email
      joinDate
      favorites {
        _id
        createdDate
        likes
        username
      }
    }
  }
`;

export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
