import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchCompetitions from "../api/competitionApi";

const MyGuesses = () => {
  const [guesses, setGuesses] = useState([]);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedGuesses = JSON.parse(localStorage.getItem("guesses")) || [];
    setGuesses(savedGuesses);
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetchCompetitions();
        setMatches(response.matches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };
    fetchMatches();
  }, []);

  const handleDelete = (matchId) => {
    const match = matches.find((m) => m.id === parseInt(matchId));
    if (!match || match.status === "FINISHED" || match.status === "IN_PLAY") {
      toast.error("Cannot delete guess for finished or in-play match.");
      return;
    }

    const updatedGuesses = guesses.filter((guess) => guess.matchId !== matchId);
    setGuesses(updatedGuesses);
    localStorage.setItem("guesses", JSON.stringify(updatedGuesses));
    toast.success("Guess deleted successfully.");
  };

  const handleEdit = (matchId) => {
    const match = matches.find((m) => m.id === parseInt(matchId));
    if (!match || match.status === "FINISHED" || match.status === "IN_PLAY") {
      toast.error("Cannot edit guess for finished or in-play match.");
      return;
    }

    navigate(`/guess/${matchId}`);
  };

  const getTeamName = (match, guess) => {
    if (guess === "home") {
      return match.homeTeam.name;
    } else if (guess === "away") {
      return match.awayTeam.name;
    } else {
      return "Draw";
    }
  };

  const getMatchDetails = (matchId) => {
    return matches.find((match) => match.id === parseInt(matchId));
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4 text-center">My Guesses</h2>
      <div className="bg-white rounded-lg shadow-md p-4 w-3/4 mx-auto">
        {guesses.length === 0 ? (
          <p>No guesses made yet.</p>
        ) : (
          guesses.map((guess, index) => {
            const match = getMatchDetails(guess.matchId);
            return (
              <div key={index} className="mb-6 border-b-2 border-gray-200 pb-4">
                {match ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={`https://crests.football-data.org/${match.homeTeam.id}.svg`}
                          alt={match.homeTeam.name}
                          className="w-8 h-8 mr-2"
                        />
                        <span className="font-semibold">
                          {match.homeTeam.name}
                        </span>
                      </div>
                      <span className="text-gray-600 mx-2">vs</span>
                      <div className="flex items-center">
                        <span className="font-semibold">
                          {match.awayTeam.name}
                        </span>
                        <img
                          src={`https://crests.football-data.org/${match.awayTeam.id}.svg`}
                          alt={match.awayTeam.name}
                          className="w-8 h-8 ml-2"
                        />
                      </div>
                    </div>
                    <p className="my-2">
                      Result:{" "}
                      {match.status === "FINISHED"
                        ? `${match.score.fullTime.home} - ${match.score.fullTime.away}`
                        : "Not played yet"}
                    </p>
                    <p className="my-2">
                      Guess:{" "}
                      {match ? getTeamName(match, guess.guess) : guess.guess}
                    </p>

                    <div className="flex justify-center">
                      <button
                        className={`bg-yellow-500 text-white p-2 rounded mr-2 ${
                          match &&
                          (match.status === "FINISHED" ||
                            match.status === "IN_PLAY")
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleEdit(guess.matchId)}
                        disabled={
                          match &&
                          (match.status === "FINISHED" ||
                            match.status === "IN_PLAY")
                        }
                      >
                        Edit
                      </button>
                      <button
                        className={`bg-red-500 text-white p-2 rounded ${
                          match &&
                          (match.status === "FINISHED" ||
                            match.status === "IN_PLAY")
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleDelete(guess.matchId)}
                        disabled={
                          match &&
                          (match.status === "FINISHED" ||
                            match.status === "IN_PLAY")
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <p>Match ID: {guess.matchId}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyGuesses;
