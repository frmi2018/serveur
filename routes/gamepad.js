import express from "express";

const router = express.Router();

// controllers
import {
  games,
  userSignup,
  userLogin,
  userPostReview,
  userGetReview,
  userGetFavoris,
} from "../controllers/gamepad";

router.get("/games", games);
router.post("/user/signup", userSignup);
router.post("/user/login", userLogin);
router.post("/user/postreview", userPostReview);
router.get("/user/getreview", userGetReview);
router.get("/user/getfavoris", userGetFavoris);

module.exports = router;
