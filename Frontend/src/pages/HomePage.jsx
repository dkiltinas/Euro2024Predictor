import Hero from "../components/Hero";
import { useRef } from "react";

const Euro2024Page = () => {
  const targetRef = useRef(null);

  const handleScroll = () => {
    targetRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div>
      <Hero
        backgroundImage="https://www.dfb.de/fileadmin/_processed_/202110/csm_248141-em_logo_stadion_2e89b007c1.jpg"
        title=""
        subtitle=""
        onClick={handleScroll}
      />
      <div ref={targetRef}></div>
    </div>
  );
};

export default Euro2024Page;
