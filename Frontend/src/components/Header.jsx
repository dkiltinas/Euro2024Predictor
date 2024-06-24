import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuItemClick = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <header>
      <div className="drawer z-10 h-24">
        <input
          id="my-drawer-3"
          type="checkbox"
          className="drawer-toggle"
          checked={drawerOpen}
          onChange={() => setDrawerOpen(!drawerOpen)}
        />
        <div className="drawer-content flex flex-col">
          <div className="w-full navbar bg-customBlue">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="my-drawer-3"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </label>
            </div>
            <Link to="/">
              <div>
                <h2 className="h-20 w-34 text-3xl font-bold text-slate-200 mt-8 pl-8 ml-12">
                  EuroGuess
                </h2>
              </div>
            </Link>

            <div className="flex-1 px-2 mx-2 "></div>

            <div className="flex-none hidden lg:block">
              <ul className="menu menu-horizontal ">
                <li>
                  <Link
                    to="/guesses"
                    className="text-white hover:bg-blue-600 px-4 py-2 rounded"
                  >
                    My Guesses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/results"
                    className="text-white hover:bg-blue-600 px-4 py-2 rounded"
                  >
                    Match Results
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="text-white hover:bg-blue-600 px-4 py-2 rounded"
                  >
                    Upcoming Matches
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-3"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 relative max-w-lg text-base font-semibold">
            <li>
              <button
                onClick={() => handleMenuItemClick("/guesses")}
                className="block p-4 hover:bg-yellow-500 text-left w-full"
              >
                My Guesses
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuItemClick("/results")}
                className="block p-4 hover:bg-yellow-500 text-left w-full"
              >
                Match Results
              </button>
            </li>
            <li>
              <button
                onClick={() => handleMenuItemClick("/")}
                className="block p-4 hover:bg-yellow-500 text-left w-full"
              >
                Upcoming Matches
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
