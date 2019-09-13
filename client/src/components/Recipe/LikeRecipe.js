import React, { Component } from "react";
import withSession from "../withSession";
import { Mutation } from "react-apollo";
import { LIKE_RECIPE, UNLIKE_RECIPE, GET_RECIPE } from "../../queries";

class LikeRecipe extends Component {
  state = {
    username: "",
    liked: false
  };
  componentDidMount() {
    const {
      session: { getCurrentUser },
      _id
    } = this.props;
    if (getCurrentUser) {
      const preLiked =
        getCurrentUser.favorites.findIndex(recipe => recipe._id === _id) > -1;
      this.setState({
        liked: preLiked,
        username: getCurrentUser.username
      });
      console.log("username", ":", getCurrentUser.username);
    }
  }
  handleClick = (likeRecipe, unlikeRecipe) => {
    this.setState(
      preState => {
        return {
          liked: !preState.liked
        };
      },
      () => {
        this.handleLikeRecipe(likeRecipe, unlikeRecipe);
      }
    );
  };
  handleLikeRecipe = (likeRecipe, unlikeRecipe) => {
    if (this.state.liked) {
      likeRecipe().then(data => {
        console.log("handleLikeRecipe", data);
        this.props.refetch();
      });
    } else {
      console.log("unliked");
      unlikeRecipe().then(data => {
        this.props.refetch();
      });
    }
  };

  updateLikeRecipe = (cache, { data: { likeRecipe } }) => {
    const { _id } = this.props;
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id }
    });
    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: { getRecipe: { ...getRecipe, likes: likeRecipe.likes + 1 } }
    });
  };

  updateUnlikeRecipe = (cache, { data: { unlikeRecipe } }) => {
    const { _id } = this.props;
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id }
    });
    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: { getRecipe: { ...getRecipe, likes: unlikeRecipe.likes - 1 } }
    });
  };

  render() {
    const { username, liked } = this.state;
    const { _id } = this.props;
    return (
      <Mutation
        mutation={UNLIKE_RECIPE}
        variables={{
          _id,
          username
        }}
        update={this.updateUnlikeRecipe}
      >
        {unlikeRecipe => {
          return (
            <Mutation
              mutation={LIKE_RECIPE}
              variables={{
                username,
                _id
              }}
              update={this.updateLikeRecipe}
            >
              {likeRecipe => {
                return (
                  username && (
                    <button
                      className="like-button"
                      onClick={() => {
                        this.handleClick(likeRecipe, unlikeRecipe);
                      }}
                    >
                      {liked ? "Unlike" : "Like"}
                    </button>
                  )
                );
              }}
            </Mutation>
          );
        }}
      </Mutation>
    );
  }
}

export default withSession(LikeRecipe);
