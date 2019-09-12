import React from "react";
import { Link } from "react-router-dom";

const SearchItem = ({ _id, name, likes }) => {
  return (
    <li>
      <Link to={`/recipes/${_id}`}>{name}</Link>
      <p>Likes : {likes}</p>
    </li>
  );
};

export default SearchItem;
