import mongoose from "mongoose";

const User = mongoose.model("User", {
  username: {
    required: true,
    type: String,
  },
  avatar: { type: mongoose.Schema.Types.Mixed, default: {} },
  email: {
    unique: true,
    type: String,
  },
  favoris: [
    {
      gameId: {
        required: true,
        unique: true,
        type: String,
      },
      gameName: {
        type: String,
      },
      gamePictureURL: {
        type: String,
      },
    },
  ],
  hash: String,
  salt: String,
  token: String,
});

module.exports = User;
