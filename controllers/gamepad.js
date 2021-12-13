const axios = require("axios");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// Import du package cloudinary pour avatar
const cloudinary = require("cloudinary").v2;

const User = require("../models/gamepad/User");
const Game = require("../models/gamepad/Game");

// Games

export const games = async (req, res) => {
  const id = req.query.id;
  const page = req.query.page;
  const ordering = req.query.ordering;
  const page_size = req.query.pagesize;
  const search = req.query.search;

  try {
    if (id) {
      await axios
        .get(
          `https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY_GAMEPAD}`
        )
        .then((response) => {
          const data = response.data;
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    } else {
      if (search === undefined) {
        await axios
          .get(
            `https://api.rawg.io/api/games?key=${process.env.API_KEY_GAMEPAD}&page_size=${page_size}&page=${page}&ordering=${ordering}`
          )
          .then((response) => {
            const data = response.data;
            res.status(200).json(data);
          })
          .catch((error) => {
            res.status(400).json({ message: error.message });
          });
      } else {
        await axios
          .get(
            `https://api.rawg.io/api/games?key=${process.env.API_KEY_GAMEPAD}&page_size=${page_size}&page=${page}&search=${search}`
          )
          .then((response) => {
            const data = response.data;
            res.status(200).json(data);
          })
          .catch((error) => {
            res.status(400).json({ message: error.message });
          });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User LOGIN / LOGOUT

export const userSignup = async (req, res) => {
  try {
    const userEmail = await User.findOne({ email: req.fields.email });
    if (userEmail) {
      res.status(400).json({ error: "This email is already used" });
    } else {
      const userUserName = await User.findOne({
        username: req.fields.username,
      });
      if (userUserName) {
        res.status(400).json({ error: "This username is already used" });
      } else {
        if (req.fields.username && req.fields.password && req.fields.email) {
          const salt = uid2(16);
          const hash = SHA256(req.fields.password + salt).toString(encBase64);
          const token = uid2(16);
          const newUser = new User({
            username: req.fields.username,
            email: req.fields.email,
            token: token,
            salt: salt,
            hash: hash,
          });

          // Avatar
          // if (req.files.picture.path) {
          //   // Envoi de l'image à cloudinary
          //   const result = await cloudinary.uploader.unsigned_upload(
          //     req.files.picture.path,
          //     "vinted_upload",
          //     {
          //       folder: `api/vinted/offers/${newOffer._id}`,
          //       public_id: "preview",
          //       cloud_name: "lereacteur",
          //     }
          //   );
          //   // ajout de l'image dans newUser
          //   newUser.avatar = result;
          // }

          await newUser.save();
          res.json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            avatar: newUser.avatar,
            token: token,
          });
        } else {
          res.status(400).json({ error: "Missing parameters" });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      if (
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
        });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

// REVIEWS

export const userPostReview = async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.fields.gameId });

    if (game) {
      // res.status(400).json({ error: "existe" });
      game.review.push({
        title: req.fields.title,
        text: req.fields.text,
        author: req.fields.author,
        username: req.fields.username,
        date: Date,
      });
      await game.save();
      res.json({
        game,
      });
    } else {
      const game = new Game({
        gameId: req.fields.gameId,
        review: [
          {
            title: req.fields.title,
            text: req.fields.text,
            author: req.fields.author,
            date: Date.now(),
          },
        ],
      });
      await game.save();
      res.json({
        game,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const userGetReview = async (req, res) => {
  try {
    const game = await Game.findOne({ gameId: req.query.id });
    if (game !== null) {
      let review = [];
      for (let i = 0; i < game.review.length; i++) {
        review.push({
          title: game.review[i].title,
          text: game.review[i].text,
          author: game.review[i].author,
          username: game.review[i].username,
          date: game.review[i].date,
        });
      }
      res.status(200).json({
        review,
      });
    } else {
      let review = [];
      res.status(200).json({
        review,
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// FAVORIS

export const userPostFavoris = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.fields.userId });
    if (user) {
      // test si jeu déjà en favoris
      let exist = false;
      for (let i = 0; i < user.favoris.length; i++) {
        if (user.favoris[i].gameId == req.fields.gameId) {
          // supprimer des favoris
          user.favoris.splice(i, 1);
          exist = true;
        }
      }
      // si pas présent alors ajouter aux favoris
      if (exist === false) {
        user.favoris.push({
          gameId: req.fields.gameId,
          gameName: req.fields.gameName,
          gamePictureURL: req.fields.gamePictureURL,
        });
      }
      await user.save();
      if (exist === true) {
        res.status(200).json({ message: "game removed" });
      } else {
        res.status(200).json({ message: "game added" });
      }
    } else {
      res.status(401).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// renvoi la liste des favoris et test si un jeu est dans les favoris

export const userGetFavoris = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.query.userId });
    if (user) {
      // créer la liste des favoris
      let listfav = [];
      let exist = false;
      for (let i = 0; i < user.favoris.length; i++) {
        // test si jeu de la requête est présent dans les favoris
        if (req.query.gameId === user.favoris[i].gameId) {
          exist = true;
        }
        listfav.push({
          gameId: user.favoris[i].gameId,
          gameName: user.favoris[i].gameName,
          gamePictureURL: user.favoris[i].gamePictureURL,
        });
      }
      res.status(200).json({
        listfav,
        exist,
      });
    } else {
      res.status(401).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
