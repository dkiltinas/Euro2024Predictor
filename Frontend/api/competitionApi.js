import axios from "axios";

const API_URL = "http://localhost:4000/matches";

const fetchCompetitions = async () => {
  const response = await axios.get(API_URL);
  const data = response.data;
  return data;
};

export default fetchCompetitions;
