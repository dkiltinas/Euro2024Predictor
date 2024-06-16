const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

app.get("/matches", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.football-data.org/v4/competitions/EC/matches",
      {
        headers: {
          "X-Auth-Token": "53824752988844ed861c87b5ba695731",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching", error);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
