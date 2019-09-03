import React from "react";
import { NavLink } from "react-router-dom";
import Signout from "../components/Auth/Signout";

const Navbar = ({ session }) => {
  return (
    <nav>
      {session && session.getCurrentUser ? (
        <NavbarAuth session={session} />
      ) : (
        <NavbarUnAuth />
      )}
    </nav>
  );
};

const NavbarAuth = ({ session }) => {
  return (
    <>
      <ul>
        <li>
          <NavLink to="/" exact>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/search" exact>
            Search
          </NavLink>
        </li>
        <li>
          <NavLink to="/recipe/add" exact>
            Add Recipe
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" exact>
            Profile
          </NavLink>
        </li>
        <li>
          <Signout />
        </li>
      </ul>
      <h4>
        Welcome, <strong>{session.getCurrentUser.username}</strong>
      </h4>
    </>
  );
};

const NavbarUnAuth = () => {
  return (
    <ul>
      <li>
        <NavLink to="/" exact>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/search" exact>
          Search
        </NavLink>
      </li>
      <li>
        <NavLink to="/signin" exact>
          Signin
        </NavLink>
      </li>
      <li>
        <NavLink to="/signup" exact>
          Signup
        </NavLink>
      </li>
    </ul>
  );
};

export default Navbar;
