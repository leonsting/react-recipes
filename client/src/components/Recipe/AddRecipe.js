import React from "react";
import { Mutation } from "react-apollo";
import Error from "../Error";
import { ADD_RECIPE, GET_ALL_RECIPES, GET_USER_RECIPES } from "../../queries";
import { withRouter } from "react-router-dom";

const initialState = {
  name: "",
  category: "Breakfast",
  description: "",
  instructions: "",
  username: ""
};

class AddRecipe extends React.Component {
  state = initialState;

  clearState = () => {
    this.setState(initialState);
  };
  handleChange = ({ target: { name, value } }) => {
    this.setState({
      // ...this.state,
      [name]: value
    });
  };

  handleSubmit = addRecipe => event => {
    event.preventDefault();
    addRecipe().then(data => {
      console.log("data", data);
      this.clearState();
      this.props.history.push("/");
    });
  };

  validateForm = () => {
    const { name, category, description, instructions } = this.state;
    return !name || !category || !description || !instructions;
  };

  componentDidMount() {
    const { session } = this.props;
    this.setState({
      username: session.getCurrentUser.username
    });
  }

  updateCache = (cache, { data: { addRecipe } }) => {
    console.log("cache", cache);
    // Read Get All Recipes query's cache
    const { getAllRecipes } = cache.readQuery({
      query: GET_ALL_RECIPES
    });

    // update Get All Recipes query' cache
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: [addRecipe, ...getAllRecipes]
      }
    });

    // Just using update cache if this query already executed and included in cache
    // otherwise using refetchQueries attributes

    // const { username } = this.state;
    // const { getUserRecipes } = cache.readQuery({
    //   query: GET_USER_RECIPES,
    //   variables: { username }
    // });
    // cache.writeQuery({
    //   query: GET_USER_RECIPES,
    //   variables: { username },
    //   data: {
    //     getUserRecipes: [addRecipe, ...getUserRecipes]
    //   }
    // });
  };

  render() {
    const { name, category, description, instructions } = this.state;
    return (
      <div className="App">
        <h2>Add Recipe</h2>
        <Mutation
          mutation={ADD_RECIPE}
          variables={this.state}
          refetchQueries={[
            {
              query: GET_USER_RECIPES,
              variables: { username: this.state.username }
            }
          ]}
          update={this.updateCache}
        >
          {(addRecipe, { data, error, loading }) => (
            <form className="form" onSubmit={this.handleSubmit(addRecipe)}>
              <input
                type="text"
                name="name"
                placeholder="Add recipe name"
                onChange={this.handleChange}
                value={name}
              />
              <select
                name="category"
                onChange={this.handleChange}
                value={category}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
              <input
                type="text"
                name="description"
                placeholder="Add description"
                onChange={this.handleChange}
                value={description}
              />
              <textarea
                name="instructions"
                cols="30"
                rows="10"
                placeholder="Add instructions"
                onChange={this.handleChange}
                value={instructions}
              ></textarea>
              <button
                disabled={loading || this.validateForm()}
                type="submit"
                className="button-primary"
              >
                Submit
              </button>
              {error && <Error error={error} />}
            </form>
          )}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(AddRecipe);
