import { gql } from "apollo-boost";
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
//#endregion

//#region Recipes mutations

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      username
      email
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
//#endregion
