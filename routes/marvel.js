import express from "express";

const router = express.Router();

// controllers
import { comics, characters } from "../controllers/marvel";

router.post("/comics", comics);
router.post("/characters", characters);

module.exports = router;
