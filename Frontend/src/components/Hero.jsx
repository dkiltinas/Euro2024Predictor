import { Link } from "react-router-dom";

const Hero = ({ backgroundImage, title, subtitle, onClick }) => {
  return (
    <div
      className={`relative h-96 flex items-center justify-center text-white bg-cover bg-center bg-no-repeat`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "top",
      }}
    >
      <div className="absolute inset-0 bg-customBlue opacity-50"></div>
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        <p className="mt-4 text-lg md:text-xl">{subtitle}</p>
        <Link to={"/"}>
          <button
            className="mt-24  sm:mt-52 px-32 py-3 relative  bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 -z-2"
            onClick={onClick}
          >
            Make a Guess!
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
