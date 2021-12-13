import mongoose from "mongoose";

const Game = mongoose.model("Game", {
  gameId: {
    required: true,
    unique: true,
    type: String,
  },
  review: [
    {
      title: String,
      text: String,
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      username: String,
      date: Date,
      note: Number,
    },
  ],
});

module.exports = Game;
