import React from "react";
import { ApolloConsumer } from "react-apollo";
import { SEARCH_RECIPES } from "../../queries";
import SearchItem from "./SearchItem";

class Search extends React.Component {
  state = {
    searchResults: []
  };
  handleSearch = client => async event => {
    // console.log("event", event);
    // Remove the synthetic event from the pool and allow references to the event to bi retained by user code
    event.persist();
    const { data } = await client.query({
      query: SEARCH_RECIPES,
      variables: {
        searchTerm: event.target.value
      }
    });
    // console.log("results", results);
    this.setState({ searchResults: data.search });
  };
  render() {
    const { searchResults } = this.state;
    return (
      <ApolloConsumer>
        {client => {
          return (
            <div className="App">
              <input
                type="text"
                className="search"
                name="searchTerm"
                placeholder="Input here to search"
                onChange={this.handleSearch(client)}
              />
              <ul>
                {searchResults.map(recipe => (
                  <SearchItem key={recipe._id} {...recipe} />
                ))}
              </ul>
            </div>
          );
        }}
      </ApolloConsumer>
    );
  }
}

export default Search;
