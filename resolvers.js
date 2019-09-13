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
      const allRecipe = await Recipe.find().sort({
        createdDate: "desc"
      });
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
    },
    search: async (parent, { searchTerm }, { Recipe }) => {
      if (searchTerm) {
        // console.log("searchTerm", searchTerm);
        const searchResults = await Recipe.find(
          {
            $text: { $search: searchTerm }
          },
          { score: { $meta: "textScore" } }
        ).sort({
          score: { $meta: "textScore" }
        });
        return searchResults;
      } else {
        return await Recipe.find().sort({
          createdDate: "desc"
        });
      }
    },
    getUserRecipes: async (parent, { username }, { Recipe }) => {
      const recipes = await Recipe.find({ username }).sort({
        createdDate: "desc"
      });
      return recipes;
    }
  },
  Mutation: {
    addRecipe: async (parent, args, context) => {
      const {
        name,
        imageUrl,
        category,
        description,
        instructions,
        username
      } = args;
      const { Recipe } = context;
      const newRecipe = await new Recipe({
        name,
        imageUrl,
        category,
        description,
        instructions,
        username
      }).save();
      console.log("new", newRecipe);
      return newRecipe;
    },

    likeRecipe: async (parent, { _id, username }, { User, Recipe }) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        { $inc: { likes: 1 } }
      );
      await User.findOneAndUpdate(
        { username },
        {
          $addToSet: { favorites: _id }
        }
      );
      return recipe;
    },

    unlikeRecipe: async (parent, { _id, username }, { User, Recipe }) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        { $inc: { likes: -1 } }
      );
      await User.findOneAndUpdate({ username }, { $pull: { favorites: _id } });
      return recipe;
    },

    deleteRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOneAndRemove({
        _id
      });
      return recipe;
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
