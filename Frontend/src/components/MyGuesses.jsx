import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fetchCompetitions from "../api/competitionApi";

const MyGuesses = () => {
  const [guesses, setGuesses] = useState([]);
  const [matches, setMatches] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
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

  const calculatePoints = (match, guess) => {
    const { score } = match;
    const result =
      score.fullTime.home > score.fullTime.away
        ? "home"
        : score.fullTime.home < score.fullTime.away
        ? "away"
        : "draw";
    const isCorrect = result === guess;
    return isCorrect ? 3 : 0;
  };

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

  useEffect(() => {
    let points = 0;
    guesses.forEach((guess) => {
      const match = matches.find((m) => m.id === parseInt(guess.matchId));
      if (match && match.status === "FINISHED") {
        points += calculatePoints(match, guess.guess);
      }
    });
    setTotalPoints(points);
  }, [guesses, matches]);

  const currentGuesses = guesses.filter((guess) => {
    const match = matches.find((m) => m.id === parseInt(guess.matchId));
    return match && match.status !== "FINISHED";
  });

  const finishedGuesses = guesses.filter((guess) => {
    const match = matches.find((m) => m.id === parseInt(guess.matchId));
    return match && match.status === "FINISHED";
  });

  const sortedGuesses = [...currentGuesses, ...finishedGuesses];

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-4 text-center">My Guesses</h2>
      <div className="mt-4 ml-40 text-left">
        <p className="mr-10 sm:font-bold mb-10">Total Points: {totalPoints}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 w-3/4 mx-auto">
        {guesses.length === 0 ? (
          <p>No guesses made yet.</p>
        ) : (
          sortedGuesses.map((guess, index) => {
            const match = getMatchDetails(guess.matchId);
            if (!match) {
              return <p key={index}>Match ID: {guess.matchId}</p>;
            }
            const pointsEarned =
              match.status === "FINISHED"
                ? calculatePoints(match, guess.guess)
                : 0;
            const isCorrectGuess = pointsEarned > 0;

            return (
              <div
                key={index}
                className={`mb-6 border-b-2 border-gray-200 pb-4 p-3 ${
                  match.status === "FINISHED" && isCorrectGuess
                    ? "bg-green-100  rounded"
                    : match.status === "FINISHED" && !isCorrectGuess
                    ? "bg-red-100  rounded"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={`https://crests.football-data.org/${match.homeTeam.id}.svg`}
                      alt={match.homeTeam.name}
                      className="w-8 h-8 mr-2"
                    />
                    <span className="font-semibold">{match.homeTeam.name}</span>
                  </div>
                  <span className="text-gray-600 mx-2">vs</span>
                  <div className="flex items-center">
                    <span className="font-semibold">{match.awayTeam.name}</span>
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
                {match.status === "FINISHED" && (
                  <>
                    <p className="my-2">
                      Guess:{" "}
                      {match ? getTeamName(match, guess.guess) : guess.guess}
                    </p>
                    <p className="mt-2">
                      {isCorrectGuess ? `+${pointsEarned} points` : "0 points"}
                    </p>
                  </>
                )}
                <div className="flex justify-center">
                  <button
                    className={`bg-yellow-500 text-white p-2 rounded mr-2 w-32 hover:bg-yellow-600 ${
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
                    className={`bg-red-500 text-white p-2 rounded w-32 hover:bg-red-600 ${
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyGuesses;
