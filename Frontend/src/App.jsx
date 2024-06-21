import Competitions from "./components/Competitions";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MatchResultsPage from "./pages/MatchResultsPage";
import GuessPage from "./pages/GuessPage";
import MyGuesses from "./components/MyGuesses";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Competitions />} />
          <Route path="/results" element={<MatchResultsPage />} />
          <Route path="/guess/:matchId" element={<GuessPage />} />
          <Route path="/guesses" element={<MyGuesses />}></Route>
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
