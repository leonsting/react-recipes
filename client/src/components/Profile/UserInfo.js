import React from "react";
import { Link } from "react-router-dom";
const formatDate = date =>
  `${new Date(date).toLocaleDateString("vi")} at ${new Date(
    date
  ).toLocaleTimeString("vi")}`;
const UserInfo = ({
  session: {
    getCurrentUser: { username, email, joinDate, favorites }
  }
}) => {
  return (
    <div>
      <h3>User Info</h3>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <p>Join Date: {formatDate(joinDate)}</p>
      <ul>
        <h3>Favorites</h3>
        {favorites.map(favorite => (
          <Link key={favorite._id}>
            <p>{favorite.name}</p>
          </Link>
        ))}
      </ul>
      {!favorites.length && <p>You have no favorites !</p>}
    </div>
  );
};

export default UserInfo;
