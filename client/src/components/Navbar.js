import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <NavbarUnAuth />
      <NavbarAuth />
    </nav>
  );
};

const NavbarAuth = () => {
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
        <button>SIGNOUT</button>
      </li>
    </ul>
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
