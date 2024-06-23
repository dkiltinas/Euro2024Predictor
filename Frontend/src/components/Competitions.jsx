import { useState, useEffect } from "react";
import fetchCompetitions from "../api/competitionApi";
import { useNavigate } from "react-router-dom";

const Competitions = () => {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();
  const noImage =
    "https://www.citypng.com/public/uploads/preview/outline-black-question-mark-symbol-icon-png-7017516949635410rg08c9rpe.png";

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetchCompetitions();
        const upcomingMatches = response.matches.filter(
          (match) => match.status !== "FINISHED"
        );
        setMatches(upcomingMatches);
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

  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    hours = hours.toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const handleMatchClick = (match) => {
    navigate(`/guess/${match.id}`);
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
    <div className="container mx-auto py-6 bg-gray-100 ">
      <h2 className="text-2xl font-bold mb-4 text-center">Upcoming Matches</h2>

      <div>
        {Object.keys(groupedMatches).map((date) => (
          <div key={date} className="mb-6">
            <p className="text-center text-gray-600 text-sm mb-4">
              {formatDate(date)}
            </p>
            {groupedMatches[date].map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow-md p-4 sm:w-3/4 mb-2 mx-auto group cursor-pointer"
                onClick={() => handleMatchClick(match)}
              >
                {" "}
                <div className="flex justify-between items-center ">
                  <div className="flex items-center">
                    <img
                      src={`https://crests.football-data.org/${match.homeTeam.id}.svg`}
                      alt={match.homeTeam.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noImage;
                      }}
                      className="w-8 h-8 mr-2"
                    />
                    <span className="font-semibold min-w-[100px] text-left">
                      {match.homeTeam.name}
                    </span>
                  </div>
                  <div className="flex flex-col items-center mx-2 min-w-[60px]">
                    <span className="font-bold">
                      {match.status === "SCHEDULED" ||
                      match.score.fullTime.home === null ||
                      match.score.fullTime.away === null
                        ? formatTime(match.utcDate)
                        : `${match.score.fullTime.home} - ${match.score.fullTime.away}`}
                    </span>
                    {match.status !== "FINISHED" && (
                      <span className="text-sm text-gray-500 group-hover:text-yellow-500">
                        Guess
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold min-w-[100px] text-right">
                      {match.awayTeam.name}
                    </span>

                    <img
                      src={`https://crests.football-data.org/${match.awayTeam.id}.svg`}
                      alt={match.awayTeam.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = noImage;
                      }}
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

export default Competitions;
