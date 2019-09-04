import React from "react";
import { Mutation } from "react-apollo";

const initialState = {
  name: "",
  category: "",
  description: "",
  instructions: ""
};

class AddRecipe extends React.Component {
  state = initialState;
  handleChange = ({ target: { name, value } }) => {
    this.setState({
      // ...this.state,
      [name]: value
    });
  };
  render() {
    return (
      <div className="App">
        <h2>Add Recipe</h2>
        <form className="form">
          <input
            type="text"
            name="name"
            placeholder="Add recipe name"
            onChange={this.handleChange}
          />
          <select name="category" onChange={this.handleChange}>
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
          />
          <textarea
            name="instructions"
            cols="30"
            rows="10"
            placeholder="Add instructions"
          ></textarea>
          <button type="submit" className="button-primary">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default AddRecipe;
