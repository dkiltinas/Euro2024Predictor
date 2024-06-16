import { useState, useEffect } from "react";
import fetchCompetitions from "../api/competitionApi";

const Competitions = () => {
  const [matches, setMatches] = useState([]);

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

  if (!matches || matches.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {matches.map((match) => (
        <div key={match.id}>
          <p> {new Date(match.utcDate).toLocaleString()}</p>
          <p>Stage: {match.stage}</p>
          <p>Group: {match.group}</p>
          <p>Status: {match.status}</p>
          <p>
            {match.homeTeam.name} vs {match.awayTeam.name}
          </p>

          <p>
            Score: {match.score.fullTime.home} - {match.score.fullTime.away}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Competitions;
