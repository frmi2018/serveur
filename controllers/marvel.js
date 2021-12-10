const axios = require("axios");

// Comics

export const comics = async (req, res) => {
  const characterId = req.query.characterId;
  const skip = req.query.skip;
  const title = req.query.title;

  try {
    // liste des comics ou est présent characterId
    if (characterId) {
      await axios
        .get(
          `https://lereacteur-marvel-api.herokuapp.com/comics/${characterId}?apiKey=${process.env.API_KEY}`
        )
        .then((response) => {
          const data = response.data;
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    } else {
      // liste de tous les comics
      await axios
        .get(
          `https://lereacteur-marvel-api.herokuapp.com/comics?title=${title}&skip=${skip}&apiKey=${process.env.API_KEY}`
        )
        .then((response) => {
          const data = response.data;
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(400).json({ message: error.message });
        });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Characters

export const characters = async (req, res) => {
  const skip = req.query.skip;
  const name = req.query.name;

  try {
    await axios
      .get(
        `https://lereacteur-marvel-api.herokuapp.com/characters?skip=${skip}&name=${name}&apiKey=${process.env.API_KEY}`
      )
      .then((response) => {
        const data = response.data;
        const newObj = {};
        const results = [];
        for (let i = 0; i < data.results.length; i++) {
          const newData = {
            thumbnail: data.results[i].thumbnail,
            name: data.results[i].name,
            description: data.results[i].description,
            _id: data.results[i]._id,
          };
          results.push(newData);
        }
        newObj.results = results;
        newObj.count = data.count;
        newObj.limit = data.limit;
        res.status(200).json(newObj);
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
