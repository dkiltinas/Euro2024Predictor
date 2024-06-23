import { useState, useEffect } from "react";
import fetchCompetitions from "../api/competitionApi";

const MatchResults = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetchCompetitions();
        setMatches(
          response.matches.filter((match) => match.status === "FINISHED")
        );
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };
    fetchMatches();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    const day = date.getDate();
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    return formattedDate.replace(day, `${day}${suffix}`);
  };

  const groupedMatches = matches.reduce((acc, match) => {
    const date = match.utcDate.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {});

  return (
    <div className="container mx-auto py-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center">Match Results</h2>
      <div>
        {Object.keys(groupedMatches).map((date) => (
          <div key={date} className="mb-6">
            <p className="text-center text-gray-600 text-sm mb-4">
              {formatDate(date)}
            </p>
            {groupedMatches[date].map((match) => (
              <div
                key={match.id}
                className=" sm:bg-white rounded-lg shadow-md p-4 sm:w-3/4 mb-2 mx-auto"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={`https://crests.football-data.org/${match.homeTeam.id}.svg`}
                      alt={match.homeTeam.name}
                      className="w-8 h-8 mr-2"
                    />
                    <span className="font-semibold min-w-[100px] text-left">
                      {match.homeTeam.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-center mx-2 min-w-[60px]">
                    <span className="font-bold">
                      {match.score.fullTime.home} - {match.score.fullTime.away}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold min-w-[100px] text-right">
                      {match.awayTeam.name}
                    </span>
                    <img
                      src={`https://crests.football-data.org/${match.awayTeam.id}.svg`}
                      alt={match.awayTeam.name}
                      className="w-8 h-8 ml-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchResults;
