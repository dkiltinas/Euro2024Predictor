import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import fetchCompetitions from "../api/competitionApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GuessPage = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [guess, setGuess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await fetchCompetitions();
        const match = response.matches.find((m) => m.id === parseInt(matchId));
        setMatch(match);

        const savedGuesses = JSON.parse(localStorage.getItem("guesses")) || [];
        const existingGuess = savedGuesses.find(
          (guess) => guess.matchId === matchId
        );
        if (existingGuess) {
          setGuess(existingGuess.guess);
        }
      } catch (error) {
        console.error("Error fetching match:", error);
      }
    };
    fetchMatch();
  }, [matchId]);

  const handleSaveGuess = () => {
    const savedGuesses = JSON.parse(localStorage.getItem("guesses")) || [];
    const updatedGuesses = savedGuesses.filter(
      (guess) => guess.matchId !== matchId
    );
    updatedGuesses.push({ matchId, guess });
    localStorage.setItem("guesses", JSON.stringify(updatedGuesses));
    toast.success("Your guess has been saved successfully!");
    navigate("/guesses");
  };

  if (!match) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Make a Guess</h2>
      <div className="bg-white rounded-lg shadow-md p-4 w-3/4 mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img
              src={`https://crests.football-data.org/${match.homeTeam.id}.svg`}
              alt={match.homeTeam.name}
              className="w-8 h-8 mr-2"
            />
            <span className="font-semibold">{match.homeTeam.name}</span>
          </div>
          <span className="font-bold">VS</span>
          <div className="flex items-center">
            <span className="font-semibold">{match.awayTeam.name}</span>
            <img
              src={`https://crests.football-data.org/${match.awayTeam.id}.svg`}
              alt={match.awayTeam.name}
              className="w-8 h-8 ml-2"
            />
          </div>
        </div>
        <div className="flex justify-around">
          <button
            className={`p-2 ${
              guess === "home" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setGuess("home")}
          >
            {match.homeTeam.name} Wins
          </button>
          <button
            className={`p-2 ${
              guess === "draw" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setGuess("draw")}
          >
            Draw
          </button>
          <button
            className={`p-2 ${
              guess === "away" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setGuess("away")}
          >
            {match.awayTeam.name} Wins
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={handleSaveGuess}
          >
            Save Guess
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuessPage;
