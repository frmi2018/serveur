import express from "express";

const router = express.Router();

// controllers
import { comics, characters } from "../controllers/marvel";

router.get("/comics", comics);
router.get("/characters", characters);

module.exports = router;
