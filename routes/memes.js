var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");
var axios = require('axios');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

async function getMemes() {
    try {
      const restAPI = JSON.parse(fs.readFileSync('./data/restAPI.json', 'utf8'));
      const api = restAPI[0].url;
      const apiURL = api || 'http://jss.restapi.co.za/memes'

      const response = await axios.get(apiURL);
      const data = response.data;
      fs.writeFileSync('./data/memes.json', JSON.stringify(data));
      console.log('Data saved to file.');
    } catch (error) {
        console.error('An error occured while fetching memes:', error);
    }
}

getMemes();

router.post('/coloredMemes', (req, res) => {
  const memeId = req.body.memeId;
  const coloredMemesArray = JSON.parse(fs.readFileSync('./data/coloredMemes.json', 'utf8')) || [];

  const existingMemeId = coloredMemesArray.find(x => x.id === memeId);

  if (!Array.isArray(coloredMemesArray)) {
    coloredMemesArray = [];
  }

  try {
    if (!existingMemeId) {
      coloredMemesArray.push({ id: memeId });

      fs.writeFileSync('./data/coloredMemes.json', JSON.stringify(coloredMemesArray, null, 2), 'utf8');
    }
  } catch (error) {
    console.error('An error occured while writing colored memes:', error);
  }
});

router.get('/coloredMemes', (req, res) => {
  try {
    const coloredMemes = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/coloredMemes.json')));
    res.json(coloredMemes);
  } catch (error) {
    console.error('Error reading coloredMemes.json:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', jsonParser, (req, res) => {
  const searchTerm = req.query.searchTerm || '';
  const filteredData = memesArray.memes.filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (req.isAuthenticated()) {
    res.render('memes', {
      data: memesArray.memes,
      searchTerm: searchTerm,
      filteredData: filteredData,
      loggedIn: true,
      currentUser: req.user
    });
  } else {
    res.render('memes', {
      data: memesArray.memes,
      searchTerm: searchTerm,
      filteredData: filteredData,
      loggedIn: false,
      currentUser: req.user
    });
  }
});

const memesArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/memes.json')));

router.get('/', (req, res) => {
  const searchTerm = req.query.searchTerm;
  if (searchTerm) {
    const filteredArray = memesArray.memes.filter(x => x.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filteredArray.length > 0) {
      res.send(filteredArray);
    } else {
      res.status(404).send('No matching results found');
    }
  } else {
    res.send(memesArray);
  }
});

module.exports = router;