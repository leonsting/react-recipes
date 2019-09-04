const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = ({ username, email }, secret, expiresIn) => {
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  User: {
    favorites: async (root, args, { User }) => {
      const user = await User.findOne({ username: root.username }).populate({
        path: "favorites",
        model: "Recipe"
      });
      return user.favorites;
    }
  },
  Query: {
    getAllRecipes: async (root, args, { Recipe }) => {
      const allRecipe = await Recipe.find();
      return allRecipe;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      });
      // const user = await User.findOne({
      //   username: currentUser.username
      // }).populate({ path: "favorites", model: "Recipe" });
      return user;
    },
    getRecipe: async (parent, args, { Recipe }) => {
      const { _id } = args;
      const recipe = await Recipe.findOne({ _id });
      return recipe;
    }
  },
  Mutation: {
    addRecipe: async (parent, args, context) => {
      const { name, category, description, instructions, username } = args;
      const { Recipe } = context;
      const newRecipe = await new Recipe({
        name,
        category,
        description,
        instructions,
        username
      }).save();
      console.log("new", newRecipe);
      return newRecipe;
    },
    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not existed !");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid password !");
      }
      return {
        token: createToken(user, process.env.SECRET, "4h")
      };
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      const existUser = await User.findOne({ username });
      if (existUser) {
        throw new Error("User are exists !");
      }
      const newUser = await new User({ username, email, password }).save();
      return {
        token: createToken(newUser, process.env.SECRET, "4h")
      };
    }
  }
};
