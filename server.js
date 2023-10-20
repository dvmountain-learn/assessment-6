const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
const path = require('path')
const Rollbar = require('rollbar')

const rollbar = new Rollbar({
  accessToken: '2bce8fa0fca541b6b29adf6c0b41a970',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname + '/public')));

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    rollbar.critical("Retrieving all robots from the database");
    res.status(200).send(botsArr);
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    rollbar.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    rollbar.warning("Trying to shuffle robots from arrays");
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    rollbar.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    rollbar.info("Finding winner from robots");
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    rollbar.error("ERROR DULING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    rollbar.debug("Retrieving all players")
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    rollbar.error("ERROR GETTING PLAYER STATS", error)
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
