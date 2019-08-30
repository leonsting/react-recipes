const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  favorites: {
    type: [Schema.Types.ObjectId],
    ref: "Recipe"
  }
});

// Encrypt password before save
// Using normal function instead of arrow function 
// because arrow function will change the scope of this
UserSchema.pre("save", function(next) {
  if (!this.isModified("password")) {
    next();
  }
  bcrypt.genSalt(10, (error, salt) => {
    if (error) {
      return next(error);
    }
    bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
